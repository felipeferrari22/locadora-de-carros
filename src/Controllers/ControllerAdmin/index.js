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


module.exports = {
    CadastroAdmin
}