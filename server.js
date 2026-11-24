// Importa o Express, biblioteca que facilita a criação do servidor e de suas rotas.
const express = require("express");
// Importa a conexão com o PostgreSQL configurada no arquivo bd.js.
const db = require("./bd");

// Cria a aplicação Express que receberá as requisições do navegador.
const app = express();

// Disponibiliza os arquivos estáticos desta pasta, como HTML e CSS. __dirname trata-se do nome do diretório(pasta) atual.
app.use(express.static(__dirname));

// Define o que o servidor faz quando recebe uma requisição GET para /transferencias.
// req representa a requisição recebida; res é usado para enviar a resposta.
app.get("/transferencias", async (req, res) => {
    // try/catch permite tratar erros que possam acontecer durante a consulta.
    try {
        // Executa a consulta no banco e aguarda seu resultado antes de continuar.
        const resultado = await db.query(
            `SELECT 
            row_number() over() as "indice",
            u.cpf as emissor,
            u.cpf as destinatario,
            valor,
            u.nome,
            u.sobrenome,
            data 
            from usuarios u inner join transferencias t 
            on u.id = t.emissor
            order by (data)`
        );
    
        // Envia as linhas retornadas pelo banco ao navegador no formato JSON.
        res.json(resultado.rows);

    // Se algo falhar no bloco try, o erro é tratado aqui.
    } catch (erro) {
        console.log(erro);
        // Informa ao navegador que ocorreu um erro interno no servidor (HTTP 500).
        res.status(500).send("Erro ao buscar transferências");
    }
});
 
// Inicia o servidor na porta 3000 e executa a função quando ele estiver ativo.
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});