import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import LoginValidator from "App/Validators/LoginValidator";
import UsersService from "App/Service/UsersService";
import Hash from "@ioc:Adonis/Core/Hash";



export default class AuthMiddleware {
  private usersService: UsersService

  constructor(){
    this.usersService = new UsersService
  }

  public async handle({ request, response }: HttpContextContract) {
    const payload = await request.validate(LoginValidator)

    const user = await this.usersService.findByEmail(payload.email)
    payload['id'] = user.id
    const passwordMatche = await Hash.verify(user.password, payload.password)
    if (!passwordMatche || !user) { throw new Error("UNAUTHORIZED")}

    const { id, name, email } = user

    return response.json({
      user: { id, email, name},
      token:  await this.usersService.generateToken(user)
    })
  }
}
