/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => { return { hello: 'world' }})
Route.resource('/products', 'ProductsController').apiOnly().except(['destroy','update','store','index'])
Route.get('/products/:page?/:limit?', 'ProductsController.index')
Route.post('/login', 'UsersController.login')
Route.post('/register', 'UsersController.store')

Route.group(() => {
  Route.post('/cart/:product/:units?', "ShoppingCartsController.store")
  Route.get('/cart', "ShoppingCartsController.index")
  Route.get('/cart/checkout', "ShoppingCartsController.checkout")
  Route.delete('/cart/:product', "ShoppingCartsController.deleteProductsInCartShopping")
  Route.delete('/cart', "ShoppingCartsController.deleteCartShopping")
  Route.put('/cart/:product/:units', "ShoppingCartsController.update")
  Route.resource('/users', 'UsersController').apiOnly().except(['store'])
  Route.resource('/products', 'ProductsController').apiOnly().except(['show','index'])
}).middleware('auth')




