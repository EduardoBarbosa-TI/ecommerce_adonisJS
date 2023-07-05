// import { ModelQueryBuilderContract } from "@ioc:Adonis/Lucid/Orm";
// import User from "App/Models/User"
// import UsersRepository from "App/Repositories/UsersRepository"
// import test from "japa"
// import { DateTime } from "luxon";
// import sinon from 'sinon'

// test.group('UserEntity', async () => {
//   test('should create a new user', async (assert) => {
//     const user = new User()
//     user.name = 'John Doe'
//     user.email = 'johndoe@example.com'
//     user.password = 'password123'
//     user.address = '123 Main St'
//     user.admin = false


//     assert.equal(user.name, 'John Doe')
//     assert.equal(user.email, 'johndoe@example.com')
//     assert.equal(user.password, 'password123')
//     assert.equal(user.address, '123 Main St')
//     assert.equal(user.admin, false)
//   })
// })

// test.group('UserRepository', () => {
//   test('should create a new user', async (assert) => {
//     const userRepository = new UsersRepository()
//     const createUserStub = sinon.stub(User, 'create')

//     const userData = {
//       name: 'John Doe',
//       email: 'johndoe@example.com',
//       password: 'password',
//     }

//     const messageCreatedUser = await userRepository.store(userData as User)
//     assert.equal(messageCreatedUser, `Usuário email ${userData.email} adicionado com sucesso!`)


//     createUserStub.restore()
//   })
//   test('should throw an error when storing a user with the same email', async (assert) => {
//     const userRepository = new UsersRepository()
//     const createUserStub = sinon.stub(User, 'create').rejects(new Error('CONFLICT'))

//     const userData = {
//       name: 'John Doe',
//       email: 'johnDoe@example.com',
//       password: 'password',
//     }
//     try {
//       await userRepository.store(userData as User)
//       await userRepository.store(userData as User)
//       assert.fail('Expected an error to be thrown.')
//     } catch (error) {
//       assert.equal(error.message, 'CONFLICT')
//     }

//     createUserStub.restore()
//   })
//   test('should find a user by ID', async (assert) => {
//     const userRepository = new UsersRepository()

//     const queryStub = sinon.stub(User, 'query')
//     const whereStub = sinon.stub().returnsThis()
//     const selectStub = sinon.stub().returnsThis()
//     const firstStub = sinon.stub().resolves({
//       id: 1,
//       name: 'John Doe',
//       email: 'johndoe@example.com',
//       address: '123 Main St',
//       admin: false,
//       createdAt: DateTime.fromISO('2023-07-04T00:00:00.000Z'),
//       updatedAt: DateTime.fromISO('2023-07-04T00:00:00.000Z'),
//     })

//     queryStub.returns({
//       where: whereStub,
//       select: selectStub,
//       first: firstStub,
//     } as unknown as ModelQueryBuilderContract<typeof User, User>)

//     const user = await userRepository.findById(1)

//     assert.equal(user.id, 1)
//     assert.equal(user.name, 'John Doe')
//     assert.equal(user.email, 'johndoe@example.com')
//     assert.equal(user.address, '123 Main St')
//     assert.equal(user.admin, false)
//     assert.equal(user.createdAt.toISO(), '2023-07-03T21:00:00.000-03:00')
//     assert.equal(user.updatedAt.toISO(), '2023-07-03T21:00:00.000-03:00')

//     sinon.assert.calledOnce(queryStub)
//     sinon.assert.calledWith(whereStub, 'id', 1)
//     sinon.assert.calledWith(selectStub, ['id', 'name', 'email', 'address', 'admin', 'createdAt', 'updatedAt'])
//     sinon.assert.calledOnce(firstStub)

//     queryStub.restore()
//   })
//   test('should throw an error when findById a not-found user', async (assert) => {
//     const userRepository = new UsersRepository()

//     const queryStub = sinon.stub(User, 'query')
//     const whereStub = sinon.stub().returnsThis()
//     const selectStub = sinon.stub().returnsThis()
//     const firstStub = sinon.stub().resolves(null);

//     queryStub.returns({
//       where: whereStub,
//       select: selectStub,
//       first: firstStub,
//     } as unknown as ModelQueryBuilderContract<typeof User, User>)

//     try {
//       await userRepository.findById(3);
//       assert.fail('Expected an error to be thrown.')
//     } catch (error) {
//       assert.equal(error.message, 'NOT_FOUND')
//     }

//     sinon.assert.calledOnce(queryStub)
//     sinon.assert.calledWith(selectStub, ['id', 'name', 'email', 'address', 'admin', 'createdAt', 'updatedAt'])
//     sinon.assert.calledOnce(firstStub)

//     queryStub.restore()
//   })
//   test('should throw an error when findByEmail a unauthorized user', async (assert) => {
//     const userRepository = new UsersRepository()

//     const queryStub = sinon.stub(User, 'query')
//     const whereStub = sinon.stub().returnsThis()
//     const selectStub = sinon.stub().returnsThis()
//     const firstStub = sinon.stub().resolves(null);

//     queryStub.returns({
//       where: whereStub,
//       select: selectStub,
//       first: firstStub,
//     } as unknown as ModelQueryBuilderContract<typeof User, User>)

//     try {
//       await userRepository.findByEmail('johndoe@example.com');
//       assert.fail('Expected an error to be thrown.')
//     } catch (error) {
//       assert.equal(error.message, 'UNAUTHORIZED')
//     }

//     sinon.assert.calledOnce(queryStub)
//     sinon.assert.calledWith(selectStub, '*')
//     sinon.assert.calledOnce(firstStub)

//     queryStub.restore()
//   })
//   test('should update a user', async (assert) => {
//     const updatedUser = {
//       id: 1,
//       name: 'Jane Doe',
//       email: 'janedoe@example.com',
//       address: '456 Elm St',
//       admin: true,
//     } as User

//     const findByIdStub = sinon.stub(UsersRepository.prototype, 'findById').resolves({} as User)
//     const updateMethodStub = sinon.stub().resolves()

//     const queryStub = sinon.stub(User, 'query').returns({
//       where: sinon.stub().returnsThis(),
//       update: updateMethodStub,
//     } as unknown as ModelQueryBuilderContract<typeof User, User>)

//     const usersRepository = new UsersRepository()
//     const result = await usersRepository.update(1, updatedUser)

//     assert.deepEqual(result, { message: 'Usuário atualizado com sucesso!' })

//     sinon.assert.calledOnce(findByIdStub)
//     sinon.assert.calledWith(findByIdStub, 1)

//     sinon.assert.calledOnce(queryStub)
//     sinon.assert.calledOnce(updateMethodStub)
//     sinon.assert.calledWith(updateMethodStub, sinon.match(updatedUser))

//     findByIdStub.restore()
//     queryStub.restore()
//   })
//   test('should throw an error when updating a not-found user', async (assert) => {
//     const updatedUser = {
//       id: 1,
//       name: 'Jane Doe',
//       email: 'janedoe@example.com',
//       address: '456 Elm St',
//       admin: true,
//     };

//     const findByIdStub = sinon.stub(UsersRepository.prototype, 'findById').resolves(undefined);

//     const usersRepository = new UsersRepository();

//     try {
//       await usersRepository.update(1, updatedUser as User);
//       assert.fail('Expected an error to be thrown');
//     } catch (error) {
//       assert.equal(error.message, 'NOT_FOUND');
//     }

//     sinon.assert.calledOnce(findByIdStub);
//     sinon.assert.calledWith(findByIdStub, 1);

//     findByIdStub.restore();
//   });
//   test('should delete a user', async (assert) => {
//     const findByIdStub = sinon.stub(UsersRepository.prototype, 'findById').resolves({} as User)
//     const deleteMethodStub = sinon.stub().resolves()

//     const queryStub = sinon.stub(User, 'query').returns({
//       where: sinon.stub().returnsThis(),
//       delete: deleteMethodStub,
//     } as unknown as ModelQueryBuilderContract<typeof User, User>)

//     const usersRepository = new UsersRepository()
//     const result = await usersRepository.delete(1)

//     assert.deepEqual(result, { message: 'Usuário deletado com sucesso!' })

//     sinon.assert.calledOnce(findByIdStub)
//     sinon.assert.calledWith(findByIdStub, 1)

//     sinon.assert.calledOnce(queryStub)
//     sinon.assert.calledOnce(deleteMethodStub)
//     sinon.assert.calledWith(deleteMethodStub)

//     findByIdStub.restore()
//     queryStub.restore()
//   })
//   test('should throw an error when delete a not-found user', async (assert) => {
//     const usersRepository = new UsersRepository()
//     const findByIdStub = sinon.stub(UsersRepository.prototype, 'findById').resolves(undefined)

//     try {
//       await usersRepository.delete(1)
//       assert.fail('Expected an error to be thrown');
//     } catch (error) {
//       assert.equal(error.message, 'NOT_FOUND')
//     }

//     sinon.assert.calledOnce(findByIdStub)
//     sinon.assert.calledWith(findByIdStub, 1)

//     findByIdStub.restore()
//   })
// });
