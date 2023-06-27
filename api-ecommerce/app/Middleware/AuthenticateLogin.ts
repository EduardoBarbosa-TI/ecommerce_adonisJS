import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import LoginValidator from "App/Validators/LoginValidator";
import UsersService from "App/Service/UsersService";
import Hash from "@ioc:Adonis/Core/Hash";



export default class AuthMiddleware {
  private usersService: UsersService

  constructor(){
    this.usersService = new UsersService
  }

  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const payload = await request.validate(LoginValidator)

    const user = await this.usersService.findByEmail(payload.email)
    if (!user) { return response.status(404).send({ message: 'Usuário não encontrado!' }) }
    payload['id'] = user.id
    const passwordMatche = await Hash.verify(user.password, payload.password)
    if (!passwordMatche) { return response.status(401).send({ message: 'Senha incorreta!' }) }

    const { id, name, email } = user

    return response.json({
      user: { id, email, name},
      token:  await this.usersService.generateToken(user)
    })
  }
}
