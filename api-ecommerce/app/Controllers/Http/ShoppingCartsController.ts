import Database from "@ioc:Adonis/Lucid/Database";
import ShoppingCart from "App/Models/ShoppingCart";

export default class ShoppingCartsController {
  public async store({request,response, params}){

    await Database.table("shopping_carts").insert({
      userId: request.user.id,
      status: "Em andamento"
    })

    const shoppingCart = await Database.from("shopping_carts").where("userId",request.user.id).first() as ShoppingCart

    await Database.table("product_shopping_carts").insert({
      productId: params.id,
      shoppingCartId: shoppingCart.id,
      unitProducts: 3
    })

    return response.status(201).json({
      message: "Deu bom"
    })
  }

  public async delete(){

    await Database.from("product_shopping_carts").where("userId",1).delete()

    // await Database.table("product_shopping_carts").insert({
    //   productId: params.id,
    //   shoppingCartId: shoppingCart.id,
    //   unitProducts: 3
    // })

    // return response.status(201).json({
    //   message: "Deu bom"
    // })
  }


}
