const express = require("express")

const router = express.Router()

const usuarioController = require("../controllers/UsuarioController")

router.post("/usuarios", usuarioController.criarUsuario)

router.get("/usuarios", usuarioController.consultarUsuarios)

router.post("/login", usuarioController.loginUsuario)
