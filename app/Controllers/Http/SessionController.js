'use strict'

class SessionController {
  async store({ request, response, auth }) {
    console.log("teste")
    const { email, password } = request.all();

    const token = await auth.attempt(email, password);

    return token;
  }
}

module.exports = SessionController
