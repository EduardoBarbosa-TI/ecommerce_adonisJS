import jwt from "jsonwebtoken";
import User from "App/Models/User";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UsersService from "App/Service/UsersService";

export default class AuthMiddleware {
  private usersService: UsersService

  constructor(){
    this.usersService = new UsersService()
  }
    public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
      const token = request.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return response.status(401).send({ message: 'Acesso Restrito!' });
      }
      try {
        const userToken = jwt.verify(token as string, 'SECRET') as User;
        const user = await this.usersService.findById(userToken.id)
        if (!user) {
          return response.status(400).send({ message: 'Usuário inexistente!' });
        }
        request.user = user
        return next();
      } catch (error) {
        return response.status(401).send({ message: 'Token Inválido' });
      }
  }
}
