const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

const LoginUsuario = (req, res) => {    
    const main = async () => {
        const {email, senha} = req.body
        const { AuthPwd, } = require('../../Services')
        
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email,
            },
        })
        const admin = await prisma.admin.findUnique({
            where: {
                email: email,
            }
        })

        if(usuario) {
            if(await AuthPwd(usuario.senha, senha)) {
                const dados = {
                    email: usuario.email,
                    nome: usuario.nome,
                    id: usuario.id,
                    belongsTo: "LOCATARIO"
                }
                const accessToken= jwt.sign(
                    dados,
                    process.env.JWT_ACCESS_TOKEN_SECRET,
                    {expiresIn: "1d"}
                )
                return res.status(202).send({accessToken, message: "Login bem-sucedido!", tipo: "solicitante"})
            } else {
                return res.status(401).send({message: "Senha incorreta"})
            }
        } else if(admin) {
            if(await AuthPwd(admin.senha, senha)) {
                const dados = {
                    email: admin.email,
                    nome: admin.nome,
                    id: admin.id,
                    belongsTo: "ADMIN"
                }
                const accessToken= jwt.sign(
                    dados,
                    process.env.JWT_ACCESS_TOKEN_SECRET,
                    {expiresIn: "1d"}
                )
                return res.status(202).send({accessToken, message: "Login bem-sucedido!", tipo: "admin"})
            } else {
                return res.status(401).send({message: "Senha incorreta"})
            }
        }else {
            return res.status(404).send({message: "Usuário não cadastrado"})
        }
    }

    main()
        .catch((err)=>{res.status(400).send(err); throw err})
        .finally(async ()=>{await prisma.$disconnect()})
}

module.exports = {
    LoginUsuario
}