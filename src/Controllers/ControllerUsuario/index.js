const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

const Login = (req, res) => {    
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
                return res.status(202).send({accessToken, message: "Login bem-sucedido!", tipo: "locatário"})
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

const BuscarVeiculos = (req, res) => {
    const main = async () => {
        const veiculo = await prisma.veiculo.findMany()

        const dados = veiculo.map((veiculoAtual) => {
            return {
                id: veiculoAtual.id,
                nome: veiculoAtual.nome,
                preco: veiculoAtual.preco,
                descricao: veiculoAtual.descricao,
            }
        })

        return res.status(200).send({message: "Busca feita com sucesso", veiculo: dados})
    }
    main()
        .catch((err)=>{res.status(400).send({message: "Erro na busca do veículos", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

const CadastroUsuario = (req, res) => {    
    const main = async () => {
        
        const {email, nome, senha, telefone} = req.body
        const {HashPwd} = require('./../../Services')
        
        try{
            await prisma.usuario.create({
                data: {
                    email: email,
                    nome: nome,
                    senha: await HashPwd(senha),
                    telefone: telefone
                }
            })
        }catch(err){
            //Erro previsto pelo Prisma -> Linha já existente
            if(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") { 
                return res.status(400).send({message: "Usuário já estava cadastrado", error: err})
            } else {
                throw err;
            }
        }
        
        return res.status(201).send({message: "Usuário Cadastrado"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro no cadastro do usuário", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}


module.exports = {
    Login,
    BuscarVeiculos,
    CadastroUsuario
}