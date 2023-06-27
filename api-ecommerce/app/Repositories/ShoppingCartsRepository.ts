
import Database from "@ioc:Adonis/Lucid/Database";
import Product from "App/Models/Product";
import ShoppingCart from "App/Models/ShoppingCart";
import User from "App/Models/User";

export default class ShoppingCartsRepository {

  public async checkout(userId: number) {
    return await Database.from('products')
    .join('product_shopping_carts', 'products.id', '=', 'product_shopping_carts.product_id')
    .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
    .join('users', 'shopping_carts.userId', '=', 'users.id')
    .where('shopping_carts.userId', userId)
    .select('product_shopping_carts.id', 'products.name as name_product', 'products.price', 'products.description', 'product_shopping_carts.unitProducts')
  }

  public async getAll(userId: number){
    return await Database.from('products')
      .join('product_shopping_carts', 'products.id', '=', 'product_shopping_carts.product_id')
      .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('shopping_carts.userId', userId)
      .select('shopping_carts.status as status','product_shopping_carts.id', 'products.name as name_product', 'products.price', 'products.description', 'product_shopping_carts.unitProducts')
  }

  public async store(user: User) {
    const shoppingCart = await user.related('shoppingCarts').create({
      status: 'Em andamento',
    });

    return shoppingCart
  }

  public async findByUser(userId: number) {
    console.log(userId)
    const user = await User.find(userId);
    if (!user) {
      return null
    }
    return await user.related('shoppingCarts').query().where('id',userId).first();
  }

  public async findByProducts(productId: number, userId: number) {
    return await Product.query()
      .join('product_shopping_carts', 'products.id', '=', 'product_shopping_carts.product_id')
      .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('shopping_carts.userId', userId)
      .where('product_shopping_carts.product_id', productId)
      .select("product_shopping_carts.id", "products.name as name_product", "products.price", "products.description", "product_shopping_carts.unitProducts as unitProducts")
      .first()
  }

  public async storeProductsShoppingCart(userId: number, productId: number, units?: number) {
    const shoppingCart = await ShoppingCart.query()
      .where('userId', userId)
      .firstOrFail()
    return await shoppingCart.related('products').attach({
      [productId]: {
        unitProducts: units
      }
    },)
  }

  public async updateByProductInShoppingCart(productId: number,userCartId: number, units: number) {
    return await Database.from("product_shopping_carts")
      .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
      .join('products', 'product_shopping_carts.product_id', '=', 'products.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('product_shopping_carts.product_id', productId)
      .where('product_shopping_carts.shopping_cart_id', userCartId)
      .update('unitProducts', units);
  }

  public async deleteByProduct(productId: number,userId: number){
    try {
      await Database.from("product_shopping_carts")
      .whereIn(
        'id',
        Database.from("product_shopping_carts")
          .join('products', 'product_shopping_carts.product_id', '=', 'products.id')
          .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
          .join('users', 'shopping_carts.userId', '=', 'users.id')
          .where('products.id', productId)
          .andWhere('shopping_carts.userId', userId)
          .select('product_shopping_carts.id')
      )
      .delete();

    } catch (error) {
      return {
        message: "Erro ao producto do carrinho de compra!"
      }
    }

  }

  public async delete(userId: number){
    try {
      await Database.from("product_shopping_carts")
      .whereIn(
        'id',
        Database.from("product_shopping_carts")
          .join('products', 'product_shopping_carts.product_id', '=', 'products.id')
          .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
          .join('users', 'shopping_carts.userId', '=', 'users.id')
          .andWhere('shopping_carts.userId', userId)
          .select('product_shopping_carts.id')
      )
      .delete();

      await ShoppingCart.query().where('userId', userId).delete()
    } catch (error) {
      return {
        message: "Erro ao deletar carrinho de compra "
      }
    }
  }
}
