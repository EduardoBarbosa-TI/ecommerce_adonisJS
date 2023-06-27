import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import ProductsServices from 'App/Service/ProductsService'
import StoreProductValidator from 'App/Validators/StoreProductValidator'
import UpdateProductValidator from 'App/Validators/UpdateProductValidator'
export default class ProductsController {
  private productsService: ProductsServices

  constructor(){
    this.productsService = new ProductsServices()
  }

  public async index({ request}: HttpContextContract) {
    const { page, limit } = request.qs()
    return await this.productsService.index(page,limit)
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(StoreProductValidator)
    return await this.productsService.store(payload as Product)
  }

  public async show({params}: HttpContextContract) {
    return await this.productsService.show(params.id)
  }

  public async update({request,params}: HttpContextContract) {
    const payload = await request.validate(UpdateProductValidator)
    return await this.productsService.update(params.id,payload as Product)
  }

  public async destroy({ params }: HttpContextContract) {
    return await this.productsService.delete(params.id)
  }
}
