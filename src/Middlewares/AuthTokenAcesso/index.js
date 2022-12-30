const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  // Authorization: {token}
  const token = req.headers['auth']

  if (token === null)
    return res.status(401).send({message: "Token não informado"})

  jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      (err, dados) => {
          if(err) return res.status(403).send({message: "Token negado", error: err})
          req.dados = dados
          next()
      }
  )
}