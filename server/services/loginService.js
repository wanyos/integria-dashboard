import { pool } from '../db/mysql.js'
import bcrypt from 'bcrypt'
import { validateCredentials } from '../util/validates.js'

const queryUser = `SELECT username from users where password=?`

export default class UsersService {
  static async postLogin(username, password) {
    const validationResult = await this.#validateAndHash(username, password)
    if (validationResult.success) {
      // const [user] = pool.query(queryUser, [password])
      const user = {
        username: 'wanyos99',
        email: 'juanjor99@gmai.com',
      }
      if (!user) throw new Error('User does not exist..')
      // const isValid = await bcrypt.compare(password, user.password) // comparar ambos password encriptando el password parametro
      // if (!isValid) throw new Error('Password is invalid...')

      //recuperar el user
      // const userValid = {
      //   username: user[0]?.username,
      //   email: user[0]?.email,
      // }

      return { status: 200, user: user }
    }
    return { status: 400, message: validationResult.errors }
  }

  static async postRegister(username, password) {
    const validationResult = this.#validateAndHash(username, password)
    if (validationResult.success) {
      // creaate user
    }
    return { status: 400, message: validationResult.errors }
  }

  static async #validateAndHash(username, password) {
    const SALT_ROUNDS = 10
    const validationResult = validateCredentials({ username, password })
    if (validationResult.success) {
      const hashPassword = await bcrypt.hash(password, SALT_ROUNDS)
      return { success: true, hashPassword }
    }
    return { success: false, errors: validationResult.error }
  }

  static postLogout() {}

  static getProtected() {}
}
