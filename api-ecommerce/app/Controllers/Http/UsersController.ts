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

  public async index({response}: HttpContextContract) {
    const user = await this.usersService.index()
    return response.status(200).send(user)
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(StoreUserValidator)
    const userCreated = await this.usersService.store(payload as User)
    return response.status(201).send(userCreated)
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
