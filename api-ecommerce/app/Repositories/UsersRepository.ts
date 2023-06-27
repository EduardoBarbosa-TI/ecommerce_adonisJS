import User from "App/Models/User";

export default class UsersRepository {

  public async findAll() {
    return await User.query().select(['id','name','email', 'address', 'admin','createdAt','updatedAt'])
  }

  public async findById(userId: number){
    return await User.query()
      .where('id',userId)
      .select(['id','name','email', 'address', 'admin','createdAt','updatedAt'])
      .first()
  }

  public async findByEmail(userId: string){
    return await User.query()
      .where('email',userId)
      .select('*')
      .first()
  }

  public async store(user: User){
    return await User.create(user)
  }

  public async update(userId: number,user: User){
    await User.query().where('id', userId).update(user)
  }

  public async delete(userId: number){
    await User.query().where('id',userId).delete()
  }
}

