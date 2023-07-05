
import Database from "@ioc:Adonis/Lucid/Database";
import Product from "App/Models/Product";
import ShoppingCart from "App/Models/ShoppingCart";
import User from "App/Models/User";

export default class ShoppingCartsRepository {

  public async checkout(user: User) {
    const query =  await Database.from('products')
      .join('product_shopping_carts', 'products.id', '=', 'product_shopping_carts.product_id')
      .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('shopping_carts.userId', user.id)
      .select('product_shopping_carts.id', 'products.name as name_product', 'products.price', 'products.description', 'product_shopping_carts.unitProducts')

    if(!query ) throw new Error('INTERNAL_SERVER_ERROR')
    if(query.length === 0 ) throw new Error('NOT_FOUND')
    return query
  }

  public async findProductsShoppingCart(user: User) {
   const query =  await Database.from('products')
      .join('product_shopping_carts', 'products.id', '=', 'product_shopping_carts.product_id')
      .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('shopping_carts.userId', user.id)
      .select('shopping_carts.status as status', 'product_shopping_carts.id', 'products.name as name_product', 'products.price', 'products.description', 'product_shopping_carts.unitProducts')

    if(!query) throw new Error('INTERNAL_SERVER_ERROR')
    return query
  }

  public async storeShoppingCart(user: User) {
    const query =  await user.related('shoppingCarts').create({ status: 'Em andamento' })
    if(!query) throw new Error()
    return query
  }

  public async findByUserShoppingCart(user: User) {
    return await user.related('shoppingCarts').query().where('userId', user.id).first()
  }

  public async findByProductShoppingCart(product: Product, user: User) {
    const productQuery =  await Product.query()
      .join('product_shopping_carts', 'products.id', '=', 'product_shopping_carts.product_id')
      .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('shopping_carts.userId', user.id)
      .where('product_shopping_carts.product_id', product.id)
      .select("product_shopping_carts.id", "products.name as name_product", "products.price", "products.description", "product_shopping_carts.unitProducts as unitProducts")
      .first()

    return productQuery
  }

  public async storeProductsShoppingCart(userId: number, product: Product, units?: number) {
    const shoppingCart = await ShoppingCart.query()
      .where('userId', userId)
      .first()

    if(!shoppingCart) throw new Error('NOT_FOUND')
    await shoppingCart.related('products').attach({
      [product.id]: {
        unitProducts: units
      }
    })
  }

  public async updateByProductInShoppingCart(product: Product, user: User, units: number) {
    const userCart = await this.findByUserShoppingCart(user)
    if(!userCart) throw new Error('NOT_FOUND')

    return  await Database.from("product_shopping_carts")
      .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
      .join('products', 'product_shopping_carts.product_id', '=', 'products.id')
      .join('users', 'shopping_carts.userId', '=', 'users.id')
      .where('product_shopping_carts.product_id', product.id)
      .where('product_shopping_carts.shopping_cart_id', userCart.id)
      .update('unitProducts', units);
  }

  public async deleteByProduct(product: Product, user: User) {
    const query = await Database.from("product_shopping_carts")
      .whereIn(
        'id',
        Database.from("product_shopping_carts")
          .join('products', 'product_shopping_carts.product_id', '=', 'products.id')
          .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
          .join('users', 'shopping_carts.userId', '=', 'users.id')
          .where('products.id', product.id)
          .andWhere('shopping_carts.userId', user.id)
          .select('product_shopping_carts.id')
      )
      .delete();

    if(!query) throw new Error('INTERNAL_SERVER_ERROR')

    return query
  }

  public async delete(user: User) {
    const query = await Database.from("product_shopping_carts")
      .whereIn(
        'id',
        Database.from("product_shopping_carts")
          .join('products', 'product_shopping_carts.product_id', '=', 'products.id')
          .join('shopping_carts', 'product_shopping_carts.shopping_cart_id', '=', 'shopping_carts.id')
          .join('users', 'shopping_carts.userId', '=', 'users.id')
          .andWhere('shopping_carts.userId', user.id)
          .select('product_shopping_carts.id')
      )
      .delete();

    if(!query) throw new Error('INTERNAL_SERVER_ERROR')

    await ShoppingCart.query().where('userId', user.id).delete()

    return {message: 'Carrinho de compras deletado com sucesso!'}
  }
}
