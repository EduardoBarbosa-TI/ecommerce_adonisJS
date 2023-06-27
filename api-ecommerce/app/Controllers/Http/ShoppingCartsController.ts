import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ShoppingCartsService from "App/Service/ShoppingCartsService";
export default class ShoppingCartsController {
  private shoppingCartsService: ShoppingCartsService

  constructor(){
    this.shoppingCartsService = new ShoppingCartsService()
  }

  public async checkout({ request}: HttpContextContract){
    return await this.shoppingCartsService.checkout(request.user.id)
  }

  public async store({ request, params}: HttpContextContract) {
    return await this.shoppingCartsService.store(request.user.id,params.product,params.units)
  }

  public async index({ request, response}: HttpContextContract) {
   const shoppingCart =  await this.shoppingCartsService.index(request.user.id)

    return response.json({
      shoppingCart
    })
  }

  public async update({ params,request, response }: HttpContextContract) {
    const productShoppingCart = await this.shoppingCartsService.update(params.product,request.user.id,params.units)

    if (!productShoppingCart) {
      return response.status(404).json({
        message: 'Produto não encontrado no carrinho!'
      })
    }

    return response.status(200).json({
      message: 'Produto do carinho atualizado!'
    })
  }

  public async deleteProductsInCartShopping({ params, request}: HttpContextContract) {
    return await this.shoppingCartsService.deleteByProduct(params.product,request.user.id)
  }

  public async deleteCartShopping({request}: HttpContextContract){
    return await this.shoppingCartsService.delete(request.user.id)
  }
}
