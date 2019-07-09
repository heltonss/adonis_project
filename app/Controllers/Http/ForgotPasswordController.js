'use strict';
const cripto = require('crypto');
const moment = require('moment');
const User = use('App/Models/User');
const Mail = use('Mail');

class ForgotPasswordController {
  async store({ request, response }) {
    try {
      const email = request.input('email');
      const user = await User.findByOrFail('email', email);
      console.log(email);

      user.token = cripto.randomBytes(10).toString('hex');
      user.token_created_at = new Date();
      await user.save();

      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message => {
          message
            .to(user.email)
            .from('helton@heltonsouza.com.br', 'Helton | T?')
            .subject('Recuperação de senha');
        }
      );
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'esse email nao existe' } });
    }
  }

  async update({ request, response }) {
    try {
      const { token, password } = request.all();
      const user = await User.findByOrFail('token', token);

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at);

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'token expired' } });
      }

      user.token = null;
      user.token_created_at = null;
      user.password = password;

      await user.save();
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'erro ao resetar senha' } });
    }
  }
}

module.exports = ForgotPasswordController;
