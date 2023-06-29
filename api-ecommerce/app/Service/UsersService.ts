import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";
import jwt from "jsonwebtoken";
import UsersRepository from "App/Repositories/UsersRepository";

export default class UsersService {
  private usersRepository: UsersRepository

  constructor() {
    this.usersRepository = new UsersRepository()
  }

  public async index() {
    return await this.usersRepository.findAll()
  }

  public async findById(userId: number) {
    const user = await this.usersRepository.findById(userId)

    return user
  }

  public async findByEmail(userId: string) {
    return await this.usersRepository.findByEmail(userId)
  }

  public async store(payload: User) {
    payload.password = await this.hashPassword(payload.password)
    return await this.usersRepository.store(payload)
  }

  public async update(userId: number, user: User) {
    if (user.password) {
      return await this.hashPassword(user.password)
    }

    return await this.usersRepository.update(userId, user)
  }

  public async delete(userId: number) {
    return await this.usersRepository.delete(userId)
  }

  public async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    }

    return jwt.sign(payload, 'SECRET', { expiresIn: '1d' })
  }

  public async hashPassword(password: string) {
    return Hash.make(password)
  }
}

