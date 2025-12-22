import { AppRoute, BaseRoute } from '@blazjs/common'
import { UserRoute } from '@modules/users/user.route'
import { ClassConstructor } from 'class-transformer'
import Container from 'typedi'

const routes: ClassConstructor<BaseRoute>[] = []

// v1
const routesV1: ClassConstructor<BaseRoute>[] = [UserRoute]

export const Routes: AppRoute = {
  version: '',
  routes: routes.map((route) => Container.get(route as ClassConstructor<BaseRoute>)),
}

export const RoutesV1: AppRoute = {
  version: 'v1',
  routes: routesV1.map((route) => Container.get(route as ClassConstructor<BaseRoute>)),
}
