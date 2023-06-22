import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import StoreProductValidator from 'App/Validators/StoreProductValidator'
import UpdateProductValidator from 'App/Validators/UpdateProductValidator'

export default class ProductsController {
  public async index({response}: HttpContextContract) {
    const products = await Database.from("products")
      .join('product_shopping_carts','products.id','=','product_shopping_carts.productId')
      .join('shopping_carts','product_shopping_carts.shoppingCartId','=','shopping_carts.id')
      .join('users','shopping_carts.userId','=','users.id')
      .select("users.id as id_user","users.name as name_user","products.name as name_product","products.price","products.description","product_shopping_carts.unitProducts")

    return response.status(200).json({
      products
    })
  }

  public async store({request, response}: HttpContextContract) {
    const payload = await request.validate(StoreProductValidator)

    if(!request.user.admin){
      return response.status(401).send({ message: 'Você não é administrador!' })
    }
    await Database.table("products").insert({
      ...payload
    })

    return response.status(201).json({
      message: "Produto adicionado com sucesso!"
    })
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
