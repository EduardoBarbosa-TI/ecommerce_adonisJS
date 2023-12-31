/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract){
    if (error.message === 'NOT_FOUND') return ctx.response.status(404).json({ message: 'Not Found' })

    if (error.message === 'UNAUTHORIZED') return ctx.response.status(401).json({ message: 'Unauthorized'})

    if (error.message === 'INTERNAL_SERVER_ERROR' || !error.message) return ctx.response.status(500).json({})

    if(error.message === 'CONFLICT') return ctx.response.status(409).json({ message: 'Conflict: email is unique'})

    return super.handle(error,ctx)
  }
}
