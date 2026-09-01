// ========================================
// Esse arquivo é o "MODEL"
// Model = a parte do código que SÓ conversa com o banco de dados.
// Ele não sabe nada sobre internet, sobre navegador, sobre nada disso.
// A única coisa que ele sabe fazer é: pegar dado do banco, ou botar dado no banco.
// ========================================

// Aqui a gente pega emprestado (require) a conexão com o banco
// que já foi configurada lá no arquivo config/database.js
// É tipo pegar o "telefone direto" que já liga pro MySQL.
const db = require('../config/database');

// ----------------------------------------
// FUNÇÃO 1: listarUsuarios
// Essa é a "receita de bolo" pra buscar TODOS os usuários no banco.
// ----------------------------------------

// "async function" = to avisando: "ei, essa receita de bolo vai ter uma
// parte que demora (esperar o banco responder), então vou usar await lá dentro"
async function listarUsuarios() {

  // Aqui eu escrevo, em português de banco de dados (SQL), o que eu quero:
  // "Me dá o id, o nome e o login de todo mundo que tá na tabela usuarios"
  // Eu NÃO peço a senha de propósito — API não deve devolver senha de ninguém, nunca.
  const sql = `SELECT id_usuario, nome, login FROM usuarios`;

  // Aqui é a parte mais importante:
  // "db.query(sql)" = manda essa pergunta (sql) pro banco de dados
  // "await" = "espera aqui parado até o banco responder, não faz mais nada enquanto isso"
  //
  // O banco sempre responde num formato meio estranho: um array com 2 coisas dentro.
  // A primeira coisa são os dados que a gente quer (os usuários).
  // A segunda coisa é uma "ficha técnica" que a gente não usa.
  // Por isso a gente escreve [usuarios] com colchetes:
  // isso pega SÓ a primeira coisa do array e ignora o resto.
  const [usuarios] = await db.query(sql);

  // "return" = "devolve isso aqui pra quem chamou essa função"
  // é tipo terminar o bolo e entregar pra pessoa que pediu.
  return usuarios;
}

// ----------------------------------------
// FUNÇÃO 2: criarUsuario
// Receita de bolo pra CADASTRAR um usuário novo no banco.
// ----------------------------------------

// Repara: essa função pede 3 "ingredientes" pra funcionar: nome, login e senha.
// Quem for chamar essa função depois, TEM que entregar esses 3 valores.
async function criarUsuario(nome, login, senha) {

  // Aqui eu escrevo em SQL: "bota um usuário novo na tabela usuarios,
  // com esse nome, esse login e essa senha"
  //
  // Repara nos "?" (interrogações) no lugar dos valores.
  // Isso é DE PROPÓSITO, é uma proteção de segurança chamada "query parametrizada".
  // Em vez de eu escrever o nome/login/senha direto dentro do texto do SQL
  // (o que seria perigoso, um hacker podia digitar SQL malicioso num campo),
  // eu deixo "?" no lugar e mando os valores separados, no array logo depois.
  const sql = `INSERT INTO 
                usuarios (nome, login, senha)
               VALUES (?, ?, ?)`;

  // db.execute(sql, [nome, login, senha])
  // = manda o SQL pro banco, e fala: "os '?' do SQL, na ORDEM, são
  //   nome primeiro, login segundo, senha terceiro"
  //
  // await = espera o banco confirmar que salvou antes de continuar
  const [resultado] = await db.execute(sql, [nome, login, senha]);

  // O "resultado" traz informações sobre o que aconteceu no INSERT,
  // tipo qual ID foi gerado automaticamente pro usuário novo.
  return resultado;
}

// ----------------------------------------
// Aqui embaixo eu "empresto" essas duas funções pra quem precisar.
// Sem essa linha, ninguém de fora consegue usar listarUsuarios nem criarUsuario,
// mesmo elas estando escritas certinho aqui em cima.
// ----------------------------------------
module.exports = {
  listarUsuarios,
  criarUsuario
};