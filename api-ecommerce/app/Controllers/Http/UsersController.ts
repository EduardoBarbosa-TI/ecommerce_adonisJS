import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreUserValidator from 'App/Validators/StoreUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import User from 'App/Models/User'
import UsersService from 'App/Service/UsersService'

export default class UsersController {
  private usersService: UsersService

  constructor(){
    this.usersService = new UsersService
  }

  public async index() {
    return this.usersService.index()
  }

  public async store({ request}: HttpContextContract) {
    const payload = await request.validate(StoreUserValidator)
    return await this.usersService.store(payload as User)
  }

  public async show({ params }: HttpContextContract) {
    return await this.usersService.findById(params.id)
  }

  public async update({ request,params }: HttpContextContract) {
    const payload = await request.validate(UpdateUserValidator)
    return await this.usersService.update(params.id,payload as User)
  }

  public async destroy({ params }: HttpContextContract) {
    return await this.usersService.delete(params.id)
  }
}
