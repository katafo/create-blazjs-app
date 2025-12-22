import { AppDataSource } from '@app/app.datasource'
import { DataSourceMode, TypeOrmRepos } from '@blazjs/datasource'
import { plainToInstance } from 'class-transformer'
import { Service } from 'typedi'
import { UserGetProfileDTO } from '../dtos/requests/user-get-profile.req.dto'
import { UserDTO } from '../dtos/user.dto'
import { User } from '../entities/user.entity'

@Service()
export class UserRepos extends TypeOrmRepos<User> {
  constructor(datasource: AppDataSource) {
    super(User, datasource)
  }

  async getProfile(data: UserGetProfileDTO, db: DataSourceMode = 'slave') {
    const { userId } = data

    return await this.datasource.query(db, async (manager) => {
      const query = manager
        .createQueryBuilder()
        .select('u.*')
        .from(User, 'u')
        .where('u.userId = :userId', { userId })

      const result = await query.getRawOne()
      return plainToInstance(UserDTO, result, { excludeExtraneousValues: true })
    })
  }
}
