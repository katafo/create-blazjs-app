import { DefaultLogger } from '@blazjs/common'
import morgan from 'morgan'

export const logger = new DefaultLogger()

export const requestLogger = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)),
      response_time: parseFloat(tokens['response-time'](req, res) || '0').toFixed(2),
      remote_addr: tokens['remote-addr'](req, res),
      user_agent: tokens['user-agent'](req, res)?.slice(0, 200) || '',
    })
  },
  {
    stream: {
      write: (message) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any
        try {
          data = JSON.parse(message)
        } catch (error) {
          return logger.warn('Invalid request log format', { message })
        }
        const { status, method, url, response_time } = data
        if (url.startsWith('/admin/queues') || url.startsWith('/healthcheck')) {
          return
        }

        const msg = `${method} ${url} - ${status} - ${response_time} ms`

        if (status >= 500) {
          return logger.error(msg, { data })
        } else if (status >= 400) {
          return logger.warn(msg, { data })
        }
        if (data.response_time && data.response_time > 1000) {
          return logger.warn(`[SLOW] ` + msg, { data })
        }
        return logger.info(msg, { data })
      },
    },
  },
)
