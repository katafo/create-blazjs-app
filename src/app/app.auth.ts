import { AppCache } from '@app/app.cache'
import { AppConfig } from '@app/app.config'
import { AppError } from '@app/app.error'
import { JwtAuth, JwtAuthPayload, JwtUnauthorizedError } from '@blazjs/auth'
import { ErrorResp } from '@blazjs/common'
import { User } from '@modules/users/entities/user.entity'
import { NextFunction, Request, Response } from 'express'
import { Service } from 'typedi'

export class AuthPayload implements JwtAuthPayload {
  sub: string
  userId: string
}

@Service()
export class AppAuth extends JwtAuth<AuthPayload> {
  constructor(config: AppConfig, cache: AppCache) {
    super(config.jwt, cache)
  }

  async authorize(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        throw AppError.Unauthorized
      }

      const payload = await this.verify(token, 'access', async (decoded) => {
        if (decoded.userId) {
          const user = await User.findOne({
            where: {
              userId: decoded.userId,
            },
          })
          return user?.salt
        }
      })
      req['sub'] = payload.sub
      req['userId'] = payload.userId
      req['accessToken'] = token

      next()
    } catch (error) {
      if (error instanceof ErrorResp && error.code === JwtUnauthorizedError.code) {
        return next(AppError.Unauthorized)
      }
      next(error)
    }
  }
}
