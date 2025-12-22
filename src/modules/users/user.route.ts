import { AppAuth } from '@app/app.auth'
import { BaseRoute } from '@blazjs/common'
import { Service } from 'typedi'
import { UserController } from './user.controller'

@Service()
export class UserRoute extends BaseRoute {
  route = 'users'

  constructor(private auth: AppAuth, private userController: UserController) {
    super()

    this.router.post('/login', this.userController.login.bind(this.userController))
    this.router.post(
      '/forgot-password',
      this.userController.forgotPassword.bind(this.userController),
    )
    this.router.post('/reset-password', this.userController.resetPassword.bind(this.userController))

    // authorized routes
    this.router.use(this.auth.authorize.bind(this.auth))
    this.router.post('/logout', this.userController.logout.bind(this.userController))
    this.router.post(
      '/change-password',
      this.userController.changePassword.bind(this.userController),
    )
    this.router.get('/profile', this.userController.getProfile.bind(this.userController))
  }
}
