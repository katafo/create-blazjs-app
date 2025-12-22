import { AppAuth, AuthPayload } from '@app/app.auth'
import { AppConfig } from '@app/app.config'
import { randomString } from '@utils/random.util'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Service } from 'typedi'
import { UserChangePasswordDTO } from './dtos/requests/user-change-password.req.dto'
import { UserForgotPasswordDTO } from './dtos/requests/user-forgot-password.req.dto'
import { UserGetProfileReqDTO } from './dtos/requests/user-get-profile.req.dto'
import { UserLoginDTO } from './dtos/requests/user-login.req.dto'
import { UserLogoutDTO } from './dtos/requests/user-logout.req.dto'
import { UserResetPasswordDTO } from './dtos/requests/user-reset-password.req.dto'
import { UserRepos } from './repos/user.repos'
import { UserErrors } from './user.error'

@Service()
export class UserService {
  constructor(private config: AppConfig, private auth: AppAuth, private userRepos: UserRepos) {}

  async login(data: UserLoginDTO) {
    const { email, password } = data

    // find user by email
    const user = await this.userRepos.findOne({
      where: {
        email: email,
      },
    })
    if (!user) throw UserErrors.UserNotFound

    // verify password
    const isValidPassword = bcrypt.compareSync(password, user.password)
    if (!isValidPassword) throw UserErrors.InvalidCredentials

    const payload: AuthPayload = {
      sub: user.userId,
      userId: user.userId,
    }

    // generate tokens
    const accessToken = await this.auth.sign(payload, 'access', user.salt)
    const refreshToken = await this.auth.sign(payload, 'refresh', user.salt)

    return {
      accessToken,
      refreshToken,
    }
  }

  async logout(data: UserLogoutDTO) {
    const { accessToken, refreshToken } = data

    // revoke tokens
    await Promise.allSettled([
      this.auth.revoke(accessToken, 'access'),
      this.auth.revoke(refreshToken, 'refresh'),
    ])

    return {
      success: true,
      message: 'Logged out successfully',
    }
  }

  async forgotPassword(data: UserForgotPasswordDTO) {
    const { email } = data

    // find user by email
    const user = await this.userRepos.findOne({
      where: {
        email: email,
      },
    })
    if (!user) throw UserErrors.UserNotFound

    // generate reset token
    const token = jwt.sign(
      {
        userId: user.userId,
      },
      this.config.jwt.secret,
      { expiresIn: '1h' },
    )

    // TODO: implement forgot password logic (e.g., send reset password email)

    return {
      success: true,
      message: 'Reset password link has been sent.',
      token: this.config.isDevelopmentEnv() ? token : undefined,
    }
  }

  async resetPassword(data: UserResetPasswordDTO) {
    const { token, newPassword } = data
    let userId: string

    // verify reset token
    try {
      const decoded = jwt.verify(token, this.config.jwt.secret) as { userId: string }
      userId = decoded.userId
    } catch (error) {
      throw UserErrors.InvalidResetPasswordToken
    }
    // find user by userId
    const user = await this.userRepos.findOne({
      where: {
        userId: userId,
      },
    })
    if (!user) throw UserErrors.UserNotFound

    // update user password
    const password = bcrypt.hashSync(newPassword, 12)
    user.password = password

    // update salt to invalidate existing tokens
    user.salt = randomString(10)

    await user.save()

    return {
      success: true,
      message: 'Password has been reset successfully.',
    }
  }

  async changePassword(data: UserChangePasswordDTO) {
    const { userId, oldPassword, newPassword } = data

    if (oldPassword === newPassword) throw UserErrors.PasswordUnchanged

    // find user by userId
    const user = await this.userRepos.findOne({
      where: {
        userId: userId,
      },
    })
    if (!user) throw UserErrors.UserNotFound

    // verify old password
    const isValidPassword = bcrypt.compareSync(oldPassword, user.password)
    if (!isValidPassword) throw UserErrors.InvalidPassword

    // update user password
    const password = bcrypt.hashSync(newPassword, 12)
    user.password = password

    // update salt to invalidate existing tokens
    user.salt = randomString(10)

    await user.save()

    // generate new tokens
    const payload: AuthPayload = {
      sub: user.userId,
      userId: user.userId,
    }

    const accessToken = await this.auth.sign(payload, 'access', user.salt)
    const refreshToken = await this.auth.sign(payload, 'refresh', user.salt)

    return {
      accessToken,
      refreshToken,
    }
  }

  async getProfile(data: UserGetProfileReqDTO) {
    const user = await this.userRepos.getProfile(data)
    return user
  }
}
