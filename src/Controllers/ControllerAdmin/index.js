const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const CadastroAdmin = (req, res) => {    
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const {email, nome, senha, telefone} = req.body
        const {HashPwd} = require('./../../Services')

        try{
            await prisma.admin.create({
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
                return res.status(400).send({message: "Administrador já estava cadastrado", error: err})
            } else {
                throw err;
            }
        }

        return res.status(201).send({message: "Administrador Cadastrado"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro no cadastro do administrador", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

const CadastroVeiculo = (req, res) => {    
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const {nome, preco, descricao} = req.body
    
        await prisma.veiculo.create({
            data: {
                nome: nome,
                preco: preco,
                descricao: descricao,
            }
        })
        return res.status(201).send({message: "Veículo Cadastrado"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro no cadastro do veículo", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

const BuscarUsuarios = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const usuarios = await prisma.usuario.findMany()
        const dados = usuarios.map((usuarioAtual) => {
            
            return {
                id: usuarioAtual.id,
                nome: usuarioAtual.nome,
                email: usuarioAtual.email,
                telefone: usuarioAtual.telefone
            }
        })

        return res.status(200).send({message: "Busca feita com sucesso", usuarios: dados})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro na busca de usuários", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

const BuscarAdmins = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const admins = await prisma.admin.findMany()
        const dados = admins.map((adminAtual) => {
            
            return {
                id: adminAtual.id,
                nome: adminAtual.nome,
                email: adminAtual.email,
                telefone: adminAtual.telefone
            }
        })

        return res.status(200).send({message: "Busca feita com sucesso", admins: dados})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro na busca de administradores", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

const DeletarVeiculos = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const id = req.params.id

        const veiculo = await prisma.veiculo.findUnique({
            where: {
                id: parseInt(id),
            },
        })
        if(veiculo === null) return res.status(404).send({message: "Veículo não encontrado"})

        await prisma.veiculo.delete({
            where: {id: parseInt(id)}
        })

        return res.status(200).send({message: "Veículo removido com sucesso"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro na remoção do veículo", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

const BuscarLocacoes = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const locacoes = await prisma.locacao.findMany()

        const dados = await Promise.all(locacoes.map(async (locacaoAtual) => {
            
            const usuario = await prisma.usuario.findUnique({
                where: {id: parseInt(locacaoAtual.locatario_id)}
            })

            return {
                id: locacaoAtual.numero_locacao,
                data_inicio: locacaoAtual.data_inicio,
                data_final: locacaoAtual.data_final,
                veiculo: locacaoAtual.veiculo,
                usuario_nome: usuario.nome,
            }
        }))

        return res.status(200).send({message: "Busca feita com sucesso", locacoes: dados})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro na busca de locações", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

const DeletarLocacao = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const id = req.params.id

        const locacao = await prisma.locacao.findUnique({
            where: {
                numero_locacao: parseInt(id),
            },
        })
        if(locacao === null) return res.status(404).send({message: "Locação não encontrada"})

        await prisma.locacao.delete({
            where: {numero_locacao: parseInt(id)}
        })

        return res.status(200).send({message: "Locação removida com sucesso"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro na remoção da locação", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

module.exports = {
    CadastroAdmin,
    CadastroVeiculo,
    BuscarUsuarios,
    BuscarAdmins,
    DeletarVeiculos,
    BuscarLocacoes,
    DeletarLocacao
}