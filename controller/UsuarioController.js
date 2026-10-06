// ========================================
// Esse arquivo é o "CONTROLLER" de usuário 🐒
// Controller = o "gerente" do restaurante.
// - A ROTA (src/index.js) é o garçom: recebe o pedido do cliente.
// - O CONTROLLER (aqui) é o gerente: decide o que fazer com o pedido.
// - O MODEL é o cozinheiro: único que mexe no banco de dados.
// ========================================

// bcrypt = a ferramenta que embaralha a senha (hash).
// Tipo o Jutsu de selamento do Naruto: depois de selada, ninguém consegue
// abrir de volta, nem o próprio dono do banco.
const bcrypt = require("bcrypt");

// Pega emprestado o Model de usuário (o cozinheiro que fala com o MySQL).
// "../model/UsuarioModel" = sobe uma pasta (sai de controllers/) e entra em model/
const usuarioModel = require("../model/UsuarioModel");

// ----------------------------------------
// criarUsuario: cadastra um usuário novo
// ----------------------------------------
// "async" = essa função tem partes que demoram (hash + banco), então usa await.
// req = o pedido que chegou | res = a resposta que a gente devolve
const criarUsuario = async (req, res) => {
    // try/catch = "tenta fazer, e se der ruim cai no catch sem derrubar o servidor"
    // (tipo o checkpoint de Dark Souls: morreu? volta pra fogueira, não pro menu 🔥)
    try {
        // Desestruturação: tira nome, login e senha de dentro do req.body
        // (o body é o "pacotinho" JSON que o front mandou).
        const {
            nome,
            login,
            senha
        } = req.body;

        // Aqui a senha vira "senhaSecreta" (a versão embaralhada).
        // Nunca, JAMAIS salva a senha crua no banco, mano!
        // OBS: do jeito que o PDF mandou, sem o segundo argumento (salt rounds).
        const senhaSecreta = await bcrypt.hash(senha);

        // Manda o Model salvar no banco.
        // Repara: vai a senhaSecreta, NÃO a senha original.
        await usuarioModel.criarUsuario(
            nome,
            login,
            senhaSecreta
        );

        // 201 = "Created" (criei com sucesso). Diferente do 200 que é só "ok".
        res.status(201).json({
            mensagem: "Usuário criado com sucesso!"
        });

    } catch (erro) {
        // Se algo deu errado em qualquer linha lá de cima, cai aqui.
        res.status(502).json({
            mensagem: "Erro ao cadastrar usuário!"
        });
    }
};

// Sem essa linha ninguém de fora enxerga o criarUsuario.
// É igual a Esfera do Dragão guardada na gaveta: existe, mas ninguém usa 🐉
module.exports = {
    criarUsuario
};
