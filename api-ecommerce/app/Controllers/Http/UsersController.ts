import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import LoginValidator from 'App/Validators/LoginValidator'
import StoreUserValidator from 'App/Validators/StoreUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import { generateToken } from './AuthController'

export default class UsersController {
  public async index() {
    const users = await Database.from("users").select("*")
    return users
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(StoreUserValidator)
    payload.password = await Hash.make(payload.password)

    await Database.table("users").insert({
      ...payload
    })

    return response.status(201).json({
      message: "Usuário adicionado com sucesso!"
    })
  }

  public async login({request,response}: HttpContextContract){
    const payload = await request.validate(LoginValidator)

    const user  = await Database.from("users").where("email",payload.email).first()
    if(!user){return response.status(404).send({ message: 'Usuário não encontrado!' })}
    payload['id'] = user.id

    const passwordMatche = await Hash.verify(user.password,payload.password)
    if(!passwordMatche){return response.status(401).send({ message: 'Senha incorreta!' })}

    return response.json({
      user,
      token: generateToken(user)
    })
  }

  public async show({params, response}: HttpContextContract) {
    const user = await Database.from("users").where("id", params.id)

    return response.status(200).json({
      user
    })
  }

  public async update({request,response,params}: HttpContextContract) {
    
    const payload = await request.validate(UpdateUserValidator)

    if(payload.password){
      payload.password = await Hash.make(payload.password)
    }

    await Database.from("users").where('id',params.id).update({
      ...payload
    })

    return response.status(200).json({
      message: "Usuário alterado com sucesso!"
    })
  }

  public async destroy({response,params}: HttpContextContract) {
    await Database.from("users").where("id", params.id).delete()
    return response.status(200)
  }
}
