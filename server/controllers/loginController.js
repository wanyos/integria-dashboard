import LoginService from '../services/loginService.js'
import jwt from 'jsonwebtoken'

export default class LoginController {
  static async postLogin(req, res) {
    const { username, password } = req.body
    try {
      const { status, user } = await LoginService.postLogin(username, password)
      // timestamp expire
      const expiresIn = '1h'
      const token = jwt.sign(
        { username: user.username, email: user.email },
        process.env.SECRET_JWT_KEY,
        { expiresIn },
      )
      return res.status(status).json({
        status,
        token,
        username: user.username,
        email: user.email,
        expirationTime: expiresIn,
      })
    } catch (error) {
      return res.status(401).json({ message: 'error login...' })
    }
  }

  static async postRegister(req, res) {
    const { username, password } = req.body
    try {
      const { status, message } = await LoginService.postRegister(username, password)
      return res.status(status).json(message)
    } catch (error) {
      return res.status(401).json({ message: 'error register...' })
    }
  }

  static async postLogout(req, res) {
    const { username, password } = req.body
    try {
      return res.status(200).json({ name: username, pass: password })
    } catch (error) {
      return res.status(403).json({ message: 'error logout...' })
    }
  }

  static async getProtected(req, res) {
    try {
      return res.status(200).json({})
    } catch (error) {
      return res.status(403).json({ message: 'error protected...' })
    }
  }
}
