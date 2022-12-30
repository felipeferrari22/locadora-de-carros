const express = require("express");
const routes = new express.Router();

const { AuthTokenAcesso } = require('./Middlewares') // Middleware de Auth do JWT

const { LoginUsuario} = require('./Controllers/ControllerUsuario')
routes.post('/Login', LoginUsuario)

const { 
    CadastroAdmin
} = require('./Controllers/ControllerAdmin')
routes.post('/CadastroAdmin', AuthTokenAcesso, CadastroAdmin)

module.exports = routes;