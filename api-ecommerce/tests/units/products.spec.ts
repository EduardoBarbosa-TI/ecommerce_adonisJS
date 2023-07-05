import Product from "App/Models/Product";
import ProductsRepository from "App/Repositories/ProductsRepository";
import sinon from 'sinon'
import test from "japa";
import { ModelQueryBuilderContract } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

test.group('productEntity', async () => {
  test('should created a new user', async (assert) => {
    const product = new Product()
    product.name = 'Bicicleta'
    product.description = 'Bicicleta toop'
    product.price = 1300.00
    product.unitStoke = 10

    assert.equal(product.name, 'Bicicleta')
    assert.equal(product.description, 'Bicicleta toop')
    assert.equal(product.price, 1300.00)
    assert.equal(product.unitStoke, 10)
  })
})

test.group('productRepository', async () => {
  test('should create a new product', async (assert) => {
    const productRepository = new ProductsRepository()
    const createProductStub = sinon.stub(Product, 'create')

    const productData = {
      name: 'Bicicleta',
      description: 'Bicicleta toop',
      price: 1300.00,
      unitStoke: 10
    }

    const messageCreatedProduct = await productRepository.store(productData as Product)
    assert.equal(messageCreatedProduct, `Produto ${productData.name} adicionado com sucesso!`)

    createProductStub.restore()
  })
  test('should throw an error when products is not-found in findAll', async (assert) => {
    const findAllStub = sinon.stub(Product, 'query').returns({
      paginate: sinon.stub().resolves({
        length: 0,
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product, Product>);

    const productsRepository = new ProductsRepository();

    try {
      await productsRepository.findAll();
      assert.fail('Expected an error to be thrown');
    } catch (error) {
      assert.equal(error.message, 'NOT_FOUND');
    }

    sinon.assert.calledOnce(findAllStub);

    findAllStub.restore();
  });
  test('should find a product by ID', async (assert) => {
    const productId = 1;
    const productData = {
      id:1,
      name: 'Bicicleta',
      description: 'Bicicleta toop',
      price: 1300.00,
      unitStoke: 10,
      createdAt: DateTime.fromISO('2023-07-04T00:00:00.000Z'),
      updatedAt: DateTime.fromISO('2023-07-04T00:00:00.000Z'),
    };

    const findByStub = sinon.stub(Product, 'findBy').resolves(productData as Product);

    const productsRepository = new ProductsRepository();
    const product = await productsRepository.findById(productId);

    assert.deepEqual(product, productData);

    assert.isNotNull(product);
    sinon.assert.calledOnce(findByStub);
    sinon.assert.calledWith(findByStub, 'id', productId);

    findByStub.restore();
  });
  test('should throw an error when product is not-found in findById', async (assert) => {
    const productId = 1;

    const findByStub = sinon.stub(Product, 'findBy').resolves(null);

    const productsRepository = new ProductsRepository();

    try {
      await productsRepository.findById(productId);
      assert.fail('Expected an error to be thrown');
    } catch (error) {
      assert.equal(error.message, 'NOT_FOUND');
    }

    sinon.assert.calledOnce(findByStub);
    sinon.assert.calledWith(findByStub, 'id', productId);

    findByStub.restore();
  });
  test('should update a product', async (assert) => {
    const productId = 1;
    const updatedProductData = {
      name: 'Bicicleta',
      description: 'Bicicleta toop',
      price: 1500.00,
      unitStoke: 3
    };

    const findByIdStub = sinon.stub(ProductsRepository.prototype, 'findById').resolves({} as Product);
    const updateMethodStub = sinon.stub().resolves();

    const queryStub = sinon.stub(Product, 'query').returns({
      where: sinon.stub().returnsThis(),
      update: updateMethodStub,
    } as unknown as ModelQueryBuilderContract<typeof Product, Product>);

    const productsRepository = new ProductsRepository();
    const result = await productsRepository.update(productId, updatedProductData as Product);

    assert.deepEqual(result, { message: 'Produto atualizado com sucesso!' });

    sinon.assert.calledOnce(findByIdStub);
    sinon.assert.calledWith(findByIdStub, productId);

    sinon.assert.calledOnce(queryStub);
    sinon.assert.calledOnce(updateMethodStub);
    sinon.assert.calledWith(updateMethodStub, sinon.match(updatedProductData));

    findByIdStub.restore();
    queryStub.restore();
  });
  test('should throw an error when updating is not-found product', async (assert) => {
    const productId = 1;
    const updatedProductData = {
      id: 1,
      name: 'Updated Product',
      price: 19.99,
      // ... outras propriedades atualizadas do produto
    };

    const findByIdStub = sinon.stub(ProductsRepository.prototype, 'findById').resolves(undefined);

    const productsRepository = new ProductsRepository();

    try {
      await productsRepository.update(productId, updatedProductData as Product);
      assert.fail('Expected an error to be thrown');
    } catch (error) {
      assert.equal(error.message, 'NOT_FOUND');
    }

    sinon.assert.calledOnce(findByIdStub);
    sinon.assert.calledWith(findByIdStub, productId);

    findByIdStub.restore();
  });
  test('should delete a product', async (assert) => {
    const productId = 1;

    const findByIdStub = sinon.stub(ProductsRepository.prototype, 'findById').resolves({} as Product);
    const deleteMethodStub = sinon.stub().resolves();

    const queryStub = sinon.stub(Product, 'query').returns({
      where: sinon.stub().returnsThis(),
      delete: deleteMethodStub,
    } as unknown as ModelQueryBuilderContract<typeof Product, Product>);

    const productsRepository = new ProductsRepository();
    const result = await productsRepository.delete(productId);

    assert.deepEqual(result, { message: 'Produto deletado com sucesso!' });

    sinon.assert.calledOnce(findByIdStub);
    sinon.assert.calledWith(findByIdStub, productId);

    sinon.assert.calledOnce(queryStub);
    sinon.assert.calledOnce(deleteMethodStub);

    findByIdStub.restore();
    queryStub.restore();
  });
  test('should throw an error when deleting is not-found product', async (assert) => {
    const productId = 1;

    const findByIdStub = sinon.stub(ProductsRepository.prototype, 'findById').resolves(undefined);

    const productsRepository = new ProductsRepository();

    try {
      await productsRepository.delete(productId);
      assert.fail('Expected an error to be thrown');
    } catch (error) {
      assert.equal(error.message, 'NOT_FOUND');
    }

    sinon.assert.calledOnce(findByIdStub);
    sinon.assert.calledWith(findByIdStub, productId);

    findByIdStub.restore();
  });
})
