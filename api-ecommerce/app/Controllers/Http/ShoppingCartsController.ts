import Database from "@ioc:Adonis/Lucid/Database";
import ShoppingCart from "App/Models/ShoppingCart";
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class ShoppingCartsController {
  public async checkout({ request, response}: HttpContextContract){
    await Database.from('shopping_carts')
      .join('users','shopping_carts.userId', '=','users.id')
      .where('shopping_carts.userId',request.user.id)
      .where('shopping_carts.status','Em andamento')
      .update('status','Compras realizada')

    return response.status(200)
  }

  public async store({ request, response, params }: HttpContextContract) {
    const product = await this.findByProductInShoppingCart(params.product, request.user.id)
    const userCart = await Database.from("shopping_carts")
      .join('users','shopping_carts.userId', '=','users.id')
      .where('status','Em andamento')
      .select('*')
      .first()
      console.log(product)
    if (product) {
      const unitProduct = Number(product.unitProducts)
      const newUnits = unitProduct + Number(params.units ?? 1)

      await this.updateByProductInShoppingCart(params.product, newUnits)
      return response.status(200).json({
        message: "Produto adicionado ao seu carrinho!"
      })
    }

    if(!userCart){
      await Database.table("shopping_carts").insert({
        userId: request.user.id,
        status: "Em andamento"
      })

    }

    const shoppingCart = await Database.from("shopping_carts").where("userId", request.user.id).first() as ShoppingCart

    await Database.table("product_shopping_carts").insert({
      productId: params.product,
      shoppingCartId: shoppingCart.id,
      unitProducts: params.units ?? 1
    })

    return response.status(201).json({
      message: 'Produto adicionado no carrinho!'
    })
  }

  public async index({ request, response }: HttpContextContract) {

    const products = await Database.from('products')
      .join('product_shopping_carts', 'products.id', '=', 'product_shopping_carts.productId')
      .join('shopping_carts', 'product_shopping_carts.shoppingCartId', '=', 'shopping_carts.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('shopping_carts.userId', request.user.id)
      .select('shopping_carts.status as status','product_shopping_carts.id', 'products.name as name_product', 'products.price', 'products.description', 'product_shopping_carts.unitProducts')
    if (products.length == 0) {
      return response.status(404).json({
        message: 'Você não tem produtos no carrinho de compras!'
      })
    }

    return response.status(200).json({
      products
    })
  }

  public async update({ params, response }: HttpContextContract) {
    const productShoppingCart = await Database.from("product_shopping_carts")
      .join('shopping_carts', 'product_shopping_carts.shoppingCartId', '=', 'shopping_carts.id')
      .join('products', 'product_shopping_carts.productId', '=', 'products.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('product_shopping_carts.productId', params.product)
      .update('unitProducts', params.units);

    if (!productShoppingCart) {
      return response.status(404).json({
        message: 'Produto não encontrado no carrinho!'
      })
    }

    return response.status(200).json({
      message: 'Produto do carinho atualizado!'
    })
  }

  public async deleteProductsInCartShopping({ params, request, response }: HttpContextContract) {
    const productShoppingCart = await Database.from("product_shopping_carts")
      .whereIn(
        'id',
        Database.from("product_shopping_carts")
          .join('products', 'product_shopping_carts.productId', '=', 'products.id')
          .join('shopping_carts', 'product_shopping_carts.shoppingCartId', '=', 'shopping_carts.id')
          .join('users', 'shopping_carts.userId', '=', 'users.id')
          .where('products.id', params.product)
          .andWhere('users.id', request.user.id)
          .andWhere('shopping_carts.userId', request.user.id)
          .select('product_shopping_carts.id')
      )
      .delete();

    if (!productShoppingCart) {
      return response.status(404).json({
        message: 'Produto não encontrado no carrinho!'
      })
    }

    return response.status(200)
  }

  public async deleteCartShopping({ request, response }: HttpContextContract) {
    const productShoppingCart = await Database.from("product_shopping_carts")
      .whereIn(
        'id',
        Database.from("product_shopping_carts")
          .join('products', 'product_shopping_carts.productId', '=', 'products.id')
          .join('shopping_carts', 'product_shopping_carts.shoppingCartId', '=', 'shopping_carts.id')
          .join('users', 'shopping_carts.userId', '=', 'users.id')
          .where('users.id', request.user.id)
          .andWhere('shopping_carts.userId', request.user.id)
          .select('product_shopping_carts.id')
      )
      .delete();

    const userShoppingCart = await Database.from("shopping_carts")
    .where('shopping_carts.userId', request.user.id)
      .andWhere('shopping_carts.status', 'Em andamento')
      .delete()

    if (!productShoppingCart || !userShoppingCart) {
      return response.status(404).json({
        message: 'Produto ou Carrinho de compras não cadastrado!'
      })
    }
    return response.status(200)
  }

  private async findByProductInShoppingCart(productId: number, userId: number) {
    const products = await Database.from("products")
      .join('product_shopping_carts', 'products.id', '=', 'product_shopping_carts.productId')
      .join('shopping_carts', 'product_shopping_carts.shoppingCartId', '=', 'shopping_carts.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('users.id', userId)
      .andWhere('product_shopping_carts.productId', productId)
      .select("product_shopping_carts.id", "products.name as name_product", "products.price", "products.description", "product_shopping_carts.unitProducts")
      .first()
    return products
  }

  private async updateByProductInShoppingCart(productId: number, units: number) {
    await Database.from("product_shopping_carts")
      .join('shopping_carts', 'product_shopping_carts.shoppingCartId', '=', 'shopping_carts.id')
      .join('products', 'product_shopping_carts.productId', '=', 'products.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('product_shopping_carts.productId', productId)
      .update('unitProducts', units);
  }
}

