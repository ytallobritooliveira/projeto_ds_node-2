// ========================================
// Esse arquivo é a "ROTA" (também chamado de Controller)
// Rota = a parte do código que conversa com o MUNDO DE FORA
// (o navegador, o Postman, qualquer um que acessar sua API).
// Ele NÃO sabe fazer SQL. Quando precisa de dado do banco,
// ele pede educadamente pro Model (aquele outro arquivo que a gente viu).
// ========================================

// Pega emprestado o Express, que é a ferramenta que cria o "servidor"
// (o servidor é tipo um atendente que fica esperando alguém bater na porta
// pra responder pedidos)
const express = require('express');

// Pega emprestado o cors, que serve pra destravar o navegador.
// Sem isso, o navegador tem medo e bloqueia a resposta da API por segurança.
const cors = require('cors');

// AQUI é a parte nova: pega emprestado o UsuarioModel inteiro
// (aquelas duas funções que a gente exportou lá em cima: listarUsuarios e criarUsuario)
// '../model/UsuarioModel' = sobe uma pasta (sai de src/) e entra em model/
const UsuarioModel = require('../model/UsuarioModel');

// Cria o "app" = isso é literalmente o servidor sendo criado.
// A partir daqui, "app" é o objeto que vai guardar TODAS as rotas.
const app = express();

// app.use() = "roda isso ANTES de qualquer rota, sempre, em toda requisição"
// cors() libera o acesso de fora
app.use(cors());

// express.json() ensina o servidor a entender quando alguém manda
// dados em formato JSON no corpo (body) da requisição.
// Sem isso, req.body chegaria vazio (undefined) e o POST não funcionaria.
app.use(express.json());

// ----------------------------------------
// ROTA 1: a rota raiz, só um "oi, tô vivo"
// ----------------------------------------
// app.get(caminho, função) = "quando alguém acessar esse caminho com GET,
// roda essa função aqui"
app.get("/", (req, res) => {
  // req = o que a pessoa mandou pra gente (request = pedido)
  // res = o que a gente vai responder pra pessoa (response = resposta)
  res.send("AURA MAIS REGOOOOOOOOOOOOOOOOOOOOOOOOooo");
});

// ----------------------------------------
// ROTA 2: listar todos os usuários
// ----------------------------------------
app.get('/usuarios', async (req, res) => {

  // try/catch = "tenta fazer isso, e SE der erro, não trava o programa,
  // só cai no catch e trata o erro com calma"
  try {

    // AQUI é a mágica do MVC: em vez de escrever SQL aqui dentro,
    // a gente só CHAMA a função que já existe lá no Model.
    // "await" porque essa função demora (ela mexe com o banco lá dentro).
    const usuarios = await UsuarioModel.listarUsuarios();

    // res.json() = "responde pra quem pediu, em formato JSON,
    // com a lista de usuários que o Model trouxe"
    res.json(usuarios);

  } catch (error) {
    // Se algo der errado (banco caiu, erro de digitação no SQL, etc),
    // cai aqui em vez de derrubar o servidor inteiro.
    console.error(error); // mostra o erro no terminal, só pra você (o dev) ver
    res.status(500).json({ erro: 'Erro ao buscar dados no banco' });
    // status 500 = código que significa "deu erro do lado do servidor"
  }
});

// ----------------------------------------
// ROTA 3: cadastrar um usuário novo
// ----------------------------------------
app.post('/usuarios', async (req, res) => {

  // req.body = os dados que a pessoa mandou (vindos do formulário do front, por ex)
  // Aqui a gente "desembrulha" o objeto e já pega os 3 campos que interessam
  const { nome, login, senha } = req.body;

  // Confere se os 3 campos vieram preenchidos.
  // "!nome" significa "se nome NÃO existir / estiver vazio"
  if (!nome || !login || !senha) {
    // return = PARA a função aqui, não deixa continuar pro resto do código
    return res.status(400).json({ erro: 'Preencha nome, login e senha' });
    // status 400 = "o pedido que você mandou tá incompleto/errado"
  }

  try {
    // De novo: não faz SQL aqui, só chama a função pronta do Model,
    // passando os 3 dados que ela pede.
    const resultado = await UsuarioModel.criarUsuario(nome, login, senha);

    // resultado.insertId = o ID novo que o MySQL gerou sozinho pro usuário
    res.status(201).json({ id_usuario: resultado.insertId, nome, login });
    // status 201 = "criado com sucesso" (o código certo pra usar em POST que cria algo)

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
});

// ----------------------------------------
// Empresta o "app" pronto (com todas as rotas já configuradas)
// pro server.js poder usar e ligar o servidor de verdade.
// ----------------------------------------
module.exports = app;