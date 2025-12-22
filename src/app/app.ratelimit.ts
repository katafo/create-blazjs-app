import { Request } from 'express'
import rateLimit from 'express-rate-limit'
import RedisStore, { RedisReply } from 'rate-limit-redis'
import Container from 'typedi'
import { AppCache } from './app.cache'

const parseIP = (req: Request): string => {
  // Priority: x-forwarded-for > x-real-ip > req.ip
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]
    return ip.trim()
  }

  const realIp = req.headers['x-real-ip']
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp
  }

  return req.ip ?? 'unknown'
}

export const setupRateLimit = (options: {
  second: number
  max: number
  prefix?: string
  skipPaths?: string[]
}) => {
  return rateLimit({
    windowMs: options.second * 1000,
    max: options.max,
    keyGenerator: (req: Request): string => parseIP(req),
    skip: (req: Request) => {
      const skipPaths = options.skipPaths ?? []
      return skipPaths.includes(req.path)
    },
    store: new RedisStore({
      sendCommand: (command: string, ...args: string[]) =>
        Container.get(AppCache).redisClient.call(command, ...args) as Promise<RedisReply>,
      prefix: options.prefix ?? 'rate-limit:',
    }),
    standardHeaders: true,
    legacyHeaders: false,
  })
}

export const globalRateLimit = setupRateLimit({
  second: 60,
  max: 100, // 100 req/m
  skipPaths: ['/health'],
})
