const mysql = require('mysql2/promise'); // Importa a biblioteca do MySQL com suporte a async/await. O /promise é uma biblioteca que vai auxiliar no retorno dos dados do banco de dados permite usar código assíncrono moderno sem precisar de callbacks complexos.

const db = mysql.createPool({ // Em vez de abrir e fechar a conexão toda vez que alguém entra na API, o pool cria uma "piscina" com várias conexões reutilizáveis. Isso evita que o banco fique lento ou caia com muitos acessos.
  host: 'localhost', // Indica que o banco de dados está rodando no seu próprio computador.
  user: 'root', // O usuário padrão do MySQL no Laragon (tem permissão total).
  password: '', // Laragon vem por padrão sem senha
  database: 'projeto_backend_angela' // Nome do banco
});

module.exports = db; // Exporta essa configuração para que outros arquivos do Node (como o seu index.js) consigam importar e usar o banco.