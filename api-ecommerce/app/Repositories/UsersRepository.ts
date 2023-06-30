import User from "App/Models/User";

export default class UsersRepository {

  public async findAll() {
    const users =  await User.query().select(['id','name','email', 'address', 'admin','createdAt','updatedAt'])
    if(!users.length) throw new Error('NOT_FOUND')
    return users
  }

  public async findById(userId: number){
    const user =  await User.query()
      .where('id',userId)
      .select(['id','name','email', 'address', 'admin','createdAt','updatedAt'])
      .first()

    if (!user) throw new Error("NOT_FOUND")
    return user
  }

  public async findByEmail(userEmail: string){
    const user = await User.query()
      .where('email',userEmail)
      .select('*')
      .first()

    if (!user) throw new Error("UNAUTHORIZED")
    return user
  }

  public async store(user: User){
    try {
      await User.create(user)
    } catch (error) {
      throw new Error('CONFLICT')
    }

    return `Usuário email ${user.email} adicionado com sucesso!`
  }

  public async update(userId: number,user: User){
    if(!await this.findById(userId))throw new Error("NOT_FOUND")
    await User.query().where('id', userId).update(user)
    return { message: `Usuário atualizado com sucesso!`}
  }

  public async delete(userId: number){
    if(!await this.findById(userId))throw new Error("NOT_FOUND")
    await User.query().where('id',userId).delete()
    return { message: `Usuário deletado com sucesso!`}
  }
}

