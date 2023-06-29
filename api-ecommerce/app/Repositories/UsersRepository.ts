import User from "App/Models/User";

export default class UsersRepository {

  public async findAll() {
   return await User.query().select(['id','name','email', 'address', 'admin','createdAt','updatedAt'])
  }

  public async findById(userId: number){
    const user =  await User.query()
      .where('id',userId)
      .select(['id','name','email', 'address', 'admin','createdAt','updatedAt'])
      .first()

    if (!user) throw new Error("NOT_FOUND")
    return user
  }

  public async findByEmail(userId: string){
    const user = await User.query()
      .where('email',userId)
      .select('*')
      .first()

    if (!user) throw new Error("UNAUTHORIZED")
    return user
  }

  public async store(user: User){
    await User.create(user)
    return { message: `Usuário email ${user.email} adicionado com sucesso!`}
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

