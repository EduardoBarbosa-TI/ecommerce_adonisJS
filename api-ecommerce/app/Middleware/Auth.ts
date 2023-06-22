import jwt from "jsonwebtoken";
import User from "App/Models/User";
import Database from "@ioc:Adonis/Lucid/Database";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AuthMiddleware {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const token = request.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return response.status(401).send({ message: 'Acesso Restrito!' });
    }
    try {
      const userToken = jwt.verify(token as string, 'SECRET') as User;
      const user = await Database.from("users").where("id", userToken.id).first();
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
