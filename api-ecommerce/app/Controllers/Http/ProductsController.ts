import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Product'
import StoreProductValidator from 'App/Validators/StoreProductValidator'
import UpdateProductValidator from 'App/Validators/UpdateProductValidator'

export default class ProductsController {
  public async index({response, params}: HttpContextContract) {
    const { page, limit } = params || 1
    const pagination = await Product.query().paginate(page,limit)
    const products = pagination.toJSON().data

    return response.status(200).json({
      products
    })
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(StoreProductValidator)

    if(!request.user.admin){
      return response.status(401).send({ message: 'Você não é administrador!' })
    }

    try {
      await Database.table("products").insert({ ...payload })
      return response.status(201).json({
        message: "Produto adicionado com sucesso!"
      })

    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao adicionar produto!'
      })
    }


  }

  public async show({params,response}: HttpContextContract) {
    const products = await Database.from("products").where("id", params.id)

    return response.status(200).json({
      products
    })
  }

  public async update({request,response,params}: HttpContextContract) {
    const payload = await request.validate(UpdateProductValidator)
    if(!request.user.admin){
      return response.status(401).send({ message: 'Você não é administrador!' })
    }
    await Database.from("products").where("id", params.id).update(payload)

    return response.status(200).json({
      message: "Produto atualizado com sucesso!"
    })
  }

  public async destroy({response,request,params}: HttpContextContract) {
    if(!request.user.admin){
      return response.status(401).send({ message: 'Você não é administrador!' })
    }
    await Database.from("products").where("id", params.id).delete()

    return response.status(200)
  }
}
