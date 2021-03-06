const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets')

const tokenBuilder = (user) => {
    const payload = {
        subject: user.user_id,
        username: user.user_name,
        role: user.user_role
      }
      const options = {
        expiresIn: '1d'
      }
      const token = jwt.sign(
        payload,
        JWT_SECRET,
        options,
      )
      return token
}

module.exports = {
    tokenBuilder
}