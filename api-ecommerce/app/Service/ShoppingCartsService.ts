
import ProductsRepository from "App/Repositories/ProductsRepository"
import ShoppingCartsRepository from "App/Repositories/ShoppingCartsRepository"
import UsersRepository from "App/Repositories/UsersRepository"

export default class ShoppingCartsService {
  private shoppingCartsRepository: ShoppingCartsRepository
  private usersRepository: UsersRepository
  private productsRepository: ProductsRepository

  constructor(){
    this.shoppingCartsRepository =  new ShoppingCartsRepository()
    this.usersRepository = new UsersRepository()
    this.productsRepository = new ProductsRepository()
  }

  public async index(userId: number){
    const user = await this.usersRepository.findById(userId)
    const products = await this.shoppingCartsRepository.findProductsShoppingCart(user)

    if (products.length == 0) throw new Error('NOT_FOUND')
    return products
  }

  public async checkout(userId: number){
    let totalPrice = 0
    const user =  await this.usersRepository.findById(userId)
    const products = await this.shoppingCartsRepository.checkout(user)

    products.forEach((product) => {
      const price = product.price
      const unitProducts = product.unitProducts
      totalPrice += price * unitProducts
    })

    return [`Preço total: ${totalPrice}`,products]
  }

  public async store(userId: number, productId: number, units?: number){
    const user = await this.usersRepository.findById(userId)
    const product  = await this.productsRepository.findById(productId)
    const productCarts = await this.shoppingCartsRepository.findByProductShoppingCart(product,user)
    const userShoppingCarts  = await this.shoppingCartsRepository.findByUserShoppingCart(user)

    if(!userShoppingCarts) {await this.shoppingCartsRepository.storeShoppingCart(user)}


    if (productCarts) {
      const unitProduct = productCarts.$extras.unitProducts
      const newUnits = unitProduct + Number(units ?? 1)
      return await this.shoppingCartsRepository.updateByProductInShoppingCart(product,user, newUnits)
    }

    return await this.shoppingCartsRepository.storeProductsShoppingCart(userId,product,units ?? 1);
  }

  public async update(productId: number,userId: number, units: number){
    const user = await this.usersRepository.findById(userId)
    const product  = await this.productsRepository.findById(productId)

    return await this.shoppingCartsRepository.updateByProductInShoppingCart(product,user,units)
  }

  public async deleteByProduct(productId: number, userId: number){
    const user = await this.usersRepository.findById(userId)
    const product  = await this.productsRepository.findById(productId)
    await this.shoppingCartsRepository.deleteByProduct(product,user)
    return {message: "Produto do carrinho deletado com sucesso!"}
  }

  public async delete(userId: number){
    const user = await this.usersRepository.findById(userId)
    return await this.shoppingCartsRepository.delete(user)
  }
}
