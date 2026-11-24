// Importa a classe Client do pacote pg, que permite conectar o Node.js ao PostgreSQL.
const { Client } = require("pg");

// Cria o cliente e informa os dados necessários para acessar o banco de dados.
const db = new Client({
    host: "localhost",
    database: "postgres",
    user: "postgres",
    password: "BemVindo!",
    port: 5432
});

// Inicia a conexão com o banco. A operação é assíncrona e retorna uma Promise.
db.connect()
    // Executa este bloco se a conexão for estabelecida.
    .then(() => {
        console.log("Conectado ao PostgreSQL com sucesso!");
    })
    // Executa este bloco se ocorrer algum erro durante a conexão.
    .catch((erro) => {
        console.log("Erro na conexão:", erro.message);
    });

// Exporta a conexão para que outros arquivos possam utilizá-la com require().
module.exports = db;