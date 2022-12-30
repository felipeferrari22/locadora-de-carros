const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const Locar = (req, res) =>  {
    const main = async () => {
        if(req.dados.belongsTo !== "LOCATARIO") return res.status(403).send({message: "Permissão negada [!Locatario]"})

        const { data_inicio, data_final, veiculo_id } = req.body

        const veiculo = await prisma.veiculo.findUnique({
            where: {id: parseInt(veiculo_id)}
        })
        if(veiculo === null) return res.status(404).send({message: "Veículo não encontrado"})

        await prisma.locacao.create({
            data: {
                data_inicio: data_inicio,
                data_final: data_final,
                veiculo: veiculo.nome,
                veiculo_id: parseInt(veiculo_id),
                locatario_id: parseInt(req.dados.id),
            }
        })

        return res.status(201).send({message: "Locação realizada"})
    }

    main()
    .catch((err)=>{res.status(400).send({message: "Erro na locação", error: err}); throw err})
    .finally(async ()=>{await prisma.$disconnect()})
}


 const BuscarMinhasLocacoes = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "LOCATARIO") return res.status(403).send({message: "Permissão negada [!Locatario]"})

        const locacoes = await prisma.locacao.findMany({
            where: {locatario_id: parseInt(req.dados.id)}
        })

        const dados = locacoes.map((locacaoAtual) => {
            return {
                data_inicio: locacaoAtual.data_inicio,
                data_final: locacaoAtual.data_final,
                veiculo: locacaoAtual.veiculo,
                id: locacaoAtual.numero_locacao
            }
        })

        return res.status(200).send({message: "Busca feita com sucesso", locacoes: dados})
    }
    main()
        .catch((err)=>{res.status(400).send({message: "Erro na busca da locações", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}


module.exports = {
    Locar,
    BuscarMinhasLocacoes
}