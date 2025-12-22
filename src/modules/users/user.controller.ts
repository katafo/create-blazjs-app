import { Request } from '@blazjs/common'
import { Service } from 'typedi'
import { UserChangePasswordReqDTO } from './dtos/requests/user-change-password.req.dto'
import { UserForgotPasswordReqDTO } from './dtos/requests/user-forgot-password.req.dto'
import { UserGetProfileReqDTO } from './dtos/requests/user-get-profile.req.dto'
import { UserLoginReqDTO } from './dtos/requests/user-login.req.dto'
import { UserLogoutReqDTO } from './dtos/requests/user-logout.req.dto'
import { UserResetPasswordReqDTO } from './dtos/requests/user-reset-password.req.dto'
import { UserService } from './user.service'

@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Request(UserLoginReqDTO)
  async login(req: UserLoginReqDTO) {
    return this.userService.login(req)
  }

  @Request(UserLogoutReqDTO)
  async logout(req: UserLogoutReqDTO) {
    return this.userService.logout(req)
  }

  @Request(UserForgotPasswordReqDTO)
  async forgotPassword(req: UserForgotPasswordReqDTO) {
    return this.userService.forgotPassword(req)
  }

  @Request(UserResetPasswordReqDTO)
  async resetPassword(req: UserResetPasswordReqDTO) {
    return this.userService.resetPassword(req)
  }

  @Request(UserChangePasswordReqDTO)
  async changePassword(req: UserChangePasswordReqDTO) {
    return this.userService.changePassword(req)
  }

  @Request(UserGetProfileReqDTO)
  async getProfile(req: UserGetProfileReqDTO) {
    return this.userService.getProfile(req)
  }
}
