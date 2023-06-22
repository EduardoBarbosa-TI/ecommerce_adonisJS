import User from 'App/Models/User';
import jwt from "jsonwebtoken";

export const generateToken = (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
  }

  return jwt.sign(payload, 'SECRET', { expiresIn: '1d' })
}


