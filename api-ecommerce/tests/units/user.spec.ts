
import  test  from "japa"
import User from "App/Models/User"
import UsersRepository from "App/Repositories/UsersRepository"


test.group('UserRepository', () => {
  test('createUser should create a new user', async (assert) => {

    const userRepository = new UsersRepository()
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      address: 'Rua Jaguatirica'
    }

    const message = await userRepository.store(userData as User)



    assert.equal(message,"Usuário email 'userData.email' adicionado com sucesso!")
  })
})
