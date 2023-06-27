
import User from "App/Models/User"
import ShoppingCartsRepository from "App/Repositories/ShoppingCartsRepository"
import UsersRepository from "App/Repositories/UsersRepository"

export default class ShoppingCartsService {
  private shoppingCartsRepository: ShoppingCartsRepository
  private usersRepository: UsersRepository

  constructor(){
    this.shoppingCartsRepository =  new ShoppingCartsRepository()
    this.usersRepository = new UsersRepository()
  }

  public async index(userId: number){
   const products = await this.shoppingCartsRepository.getAll(userId)

    if (products.length == 0) {
      return {
        message: 'Você não tem produtos no carrinho de compras!'
      }
    }
    return products
  }

  public async checkout(userId: number){
    let totalPrice = 0
    const products = await this.shoppingCartsRepository.checkout(userId)

    products.forEach((product) => {
      const price = product.price
      const unitProducts = product.unitProducts
      totalPrice += price * unitProducts
    })

    return [`Preço total: ${totalPrice}`,products]
  }

  public async store(userId: number, productId: number, units?: number){
    const productCarts = await this.shoppingCartsRepository.findByProducts(productId,userId)
    const userCart = await this.shoppingCartsRepository.findByUser(userId)

    if(!userCart){
      const user = await this.usersRepository.findById(userId)
      await this.shoppingCartsRepository.store(user as User)
    }

    if (productCarts) {
      const unitProduct = productCarts.$extras.unitProducts
      const newUnits = unitProduct + Number(units ?? 1)
      return await this.shoppingCartsRepository.updateByProductInShoppingCart(productId,userId, newUnits)
    }

    return await this.shoppingCartsRepository.storeProductsShoppingCart(userId,productId,units ?? 1);
  }

  public async update(productId: number,userId: number, units: number){
    const userCart = await this.shoppingCartsRepository.findByUser(userId)
    if(!userCart){
      return {
        message: "Usuário não tem carrinho de compras"
      }
    }
    return await this.shoppingCartsRepository.updateByProductInShoppingCart(productId,userCart.id,units)
  }

  public async deleteByProduct(productId: number, userId: number){
    return await this.shoppingCartsRepository.deleteByProduct(productId,userId)
  }

  public async delete(userId: number){
    return await this.shoppingCartsRepository.delete(userId)
  }
}
