// Importa o Express, framework que facilita criar rotas HTTP
// (GET, POST, etc) sem ter que lidar com o módulo "http" puro do Node.

const express = require('express')

// Importa o pool de conexão que você configurou no outro arquivo.
// '../config/database' = sobe uma pasta (de src/ pra raiz) e entra em config/

const connection = require('../config/database'); // Conecta com o connection.js

// Importa o pacote cors, que serve pra "destravar" o navegador
// quando o front (rodando numa origem, ex: file:// ou localhost:5500)
// tenta fazer fetch pra API (rodando em localhost:3000).
// Sem isso, o navegador BLOQUEIA a resposta por segurança (Same-Origin Policy).

const cors = require('cors')

// Cria a aplicação Express. É esse "app" que vai guardar todas as rotas.

const app = express();

// Middleware = função que roda ANTES das rotas, em toda requisição.
// app.use(cors()) libera qualquer site (origem) a acessar essa API.
// Sem parâmetro = libera geral (bom só pra desenvolvimento).
app.use(cors());

// Middleware que ensina o Express a entender JSON no corpo (body)
// das requisições. Sem isso, "req.body" chegaria undefined
// quando o front mandar dados no POST.

app.use(express.json()); // Permite que o express entenda requisições com JSON no corpo da requisição.

app.get("/", (req, res) => { //o app.get pode ser chamado de rota ou endpoint
    res.send("AURA MAIS REGOOOOOOOOOOOOOOOOOOOOOOoooo");
});
//isso pode ser chamado de rota ou endpoint.
// Rota GET "/usuarios" - lista todos os usuários cadastrados.
// "async" porque dentro tem "await" (esperar o banco responder).
app.get('/usuarios', async (req, res) => {
  try {
    // connection.query() manda o SQL pro banco e espera a resposta.
    // O retorno do mysql2 vem num array: [linhas, metadados].
    // Por isso desestruturamos só a primeira posição: [usuarios]
    const [usuarios] = await connection.query(
      'SELECT id_usuario, nome, login FROM usuarios'
      // Reparo: NÃO seleciono "senha" aqui de propósito.
      // Não faz sentido a API devolver senha pro front, mesmo em projeto de estudo.
    );

    // res.json() converte o array de usuários em JSON
    // e já manda com o header Content-Type correto.
    res.json(usuarios);

  } catch (error) {
    // Se der qualquer erro (banco fora do ar, SQL errado, etc),
    // cai aqui em vez de derrubar o servidor.
    console.error(error); // mostra o erro no terminal, pra você debugar
    res.status(500).json({ erro: 'Erro ao buscar dados no banco' });
    // status 500 = "erro interno do servidor"
  }
});

// Rota POST "/usuarios" - cadastra um novo usuário.
// POST é usado quando você está ENVIANDO dados pra criar algo novo.
app.post('/usuarios', async (req, res) => {
// req.body é o JSON que o front mandou no fetch (body: JSON.stringify(...))
// Aqui a gente já "desestrutura" pegando só os 3 campos que interessam.
  const {nome, login, senha} = req.body
   // Validação simples: se faltar algum campo, nem tenta salvar no banco.
  if (!nome || !login || !senha) {
    return res.status(400).json({ erro: 'Preencha nome, login e senha' });
    // status 400 = "requisição inválida" (erro de quem mandou os dados)
    // o "return" aqui é pra PARAR a função, senão ela ia continuar
    // e tentar rodar o INSERT mesmo sem os dados.
  }
  try {
    // Query parametrizada: os "?" são substituídos pelos valores do array,
    // NA ORDEM que aparecem. Isso é importante por SEGURANÇA:
    // evita SQL Injection (alguém digitar SQL malicioso no campo nome, por ex).
    // NUNCA faça isso concatenando string tipo `INSERT INTO... VALUES ('${nome}'...)`.
    const [resultado] = await connection.query(
      'INSERT INTO usuarios (nome, login, senha) VALUES (?, ?, ?)',
      [nome, login, senha]
    );

    // "resultado" é um objeto com informações do INSERT.
    // resultado.insertId = o ID que o MySQL gerou automaticamente (AUTO_INCREMENT)
    // pra esse novo usuário.
    res.status(201).json({ id_usuario: resultado.insertId, nome, login });
    // status 201 = "criado com sucesso" (padrão pra POST que cria algo)

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
});

// Exporta o "app" pronto (com todas as rotas configuradas)
// pra ser usado no server.js, que é quem realmente "liga" o servidor.
module.exports = app;