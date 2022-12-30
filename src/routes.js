const express = require("express");
const routes = new express.Router();

const { AuthTokenAcesso } = require('./Middlewares') // Middleware de Auth do JWT

const { 
    Login, 
    BuscarVeiculos, 
    CadastroUsuario 
} = require('./Controllers/ControllerUsuario')
routes.post('/Login', Login)
routes.get('/BuscarVeiculos', BuscarVeiculos)
routes.post('/Cadastro', CadastroUsuario)

const { 
    CadastroAdmin, 
    CadastroVeiculo, 
    BuscarUsuarios, 
    BuscarAdmins, 
    DeletarVeiculos,
    BuscarLocacoes,
    DeletarLocacao
} = require('./Controllers/ControllerAdmin')
routes.post('/CadastroAdmin', AuthTokenAcesso, CadastroAdmin)
routes.post('/CadastroVeiculo', AuthTokenAcesso, CadastroVeiculo)
routes.get('/BuscarUsuarios', AuthTokenAcesso, BuscarUsuarios)
routes.get('/BuscarAdmins', AuthTokenAcesso, BuscarAdmins)
routes.delete('/DeletarVeiculo/:id', AuthTokenAcesso, DeletarVeiculos)
routes.get('/BuscarLocacoes', AuthTokenAcesso, BuscarLocacoes)
routes.delete('/DeletarLocacao/:id', AuthTokenAcesso, DeletarLocacao)

const { 
    Locar, 
    BuscarMinhasLocacoes 
} = require('./Controllers/ControllerLocatario')
routes.post('/Locar', AuthTokenAcesso, Locar)
routes.get('/BuscarMinhasLocacoes/:id', AuthTokenAcesso, BuscarMinhasLocacoes)

module.exports = routes;