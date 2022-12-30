const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Configura sua aplicação express (API)
const app = express();
app.use(cors());
app.use(express.json());
app.use(require("./routes.js"));
app.use(express.static('public'));

// ? Acesso ao .env: process.env.NOME_DA_VARIAVEL

// Configura o servidor HTTP
const http = require("http").Server(app);
http.listen(3000, ()=>{
    console.log('HTTP ouvindo na porta 3000');
});