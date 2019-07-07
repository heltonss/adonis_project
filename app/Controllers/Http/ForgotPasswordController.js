'use strict'
const cripto = require('crypto');
const User = use('App/Models/User');
const Mail = use('Mail')

class ForgotPasswordController {
  async store({ request, response }) {
    try {
      const email = request.input('email');
      const user = await User.findByOrFail('email', email);

      user.token = cripto.randomBytes(10).toString('hex');
      user.token_created_at = new Date();

      await user.save();

      await Mail.send(['emails.forgot_password'], { email, token: user.token, link: `${request.input('redirect_url')}?token=4${uers.token}` }, message => {
        message.to(user.email)
          .from('helton@heltonsouza.com.br', 'Helton | T?')
          .subject('Recuperação de senha')
      })
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'esse email nao existe' } })
    }
  }
}

module.exports = ForgotPasswordController
