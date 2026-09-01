const connection = require('../config/database')
// model é a camada mais proxima do banco de dados
const criarUsuario = async ( // async é pq minha aplicação nao vai parar de funcinar, roda de forma separada.
                             //  não precisa parar so para fazer aquilo
    nome,
    login,
    senha

) => { // qnd se mexe com o bd tem q aguardar uma resposta do bd 
    const sql = `INSERT INTO 
                  usuarios (nome, login, senha)
                 VALUES (?, ?, ?)`;
    
    // resultado da ação do banco
    const [resultado] = await db.execute(sql, [nome, login, senha]); // o banco que vai trazer uma resposta pra ca
    return resultado;
    
}