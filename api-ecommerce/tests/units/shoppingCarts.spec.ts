import test from 'japa'
import sinon from 'sinon'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import ShoppingCartsRepository from 'App/Repositories/ShoppingCartsRepository'

test.group('ShoppingCartRepository - checkout', () => {
  test('should throw an error when shoppingCart is not-found in checkout', async (assert) => {
    const user = new User()
    user.id = 1

    const fromStub = sinon.stub(Database, 'from').returns({
      join: sinon.stub().returnsThis(),
      where: sinon.stub().returnsThis(),
      select: sinon.stub().resolves([]),
    } as any)

    const shoppingCartRepository = new ShoppingCartsRepository()

    try {
      await shoppingCartRepository.checkout(user)
      assert.fail('Expected an error to be thrown')
    } catch (error) {
      assert.equal(error.message, 'NOT_FOUND')
    }

    fromStub.restore()
  })
  test('should throw an error when shoppingCart is internal-server-error in checkout', async (assert) => {
    const user = new User()
    user.id = 1

    const fromStub = sinon.stub(Database, 'from').returns({
      join: sinon.stub().returnsThis(),
      where: sinon.stub().returnsThis(),
      select: sinon.stub().resolves(undefined),
    } as any)

    const shoppingCartRepository = new ShoppingCartsRepository()

    try {
      await shoppingCartRepository.checkout(user)
      assert.fail('Expected an error to be thrown')
    } catch (error) {
      assert.equal(error.message, 'INTERNAL_SERVER_ERROR')
    }

    fromStub.restore()
  })
})
