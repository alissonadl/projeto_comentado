const express = require("express");
const db = require("./bd");
const app = express();

app.use(express.static(__dirname)); // Permite abrir seus arquivos HTML e CSS no navegador
app.use(express.json()); // Permite o servidor ler os dados enviados pelo formulário

app.listen(3000, function () {
    console.log("Servidor rodando na porta 3000"); // Liga o servidor
});

// Busca as transferências para mostrar na tela
app.get("/transferencias", async function (req, res) {
    const resultado = await db.query(
        `SELECT 
            row_number() OVER (ORDER BY transferencias.data) AS "indice",
            usuarios_emissor.cpf AS cpf_emissor,
            usuarios_destinatario.cpf AS cpf_destinatario,
            transferencias.valor,
            usuarios_emissor.nome AS nome_emissor,
            usuarios_emissor.sobrenome AS sobrenome_emissor,
            usuarios_destinatario.nome AS nome_destinatario,
            usuarios_destinatario.sobrenome AS sobrenome_destinatario,
            transferencias.data
        FROM transferencias
        INNER JOIN usuarios AS usuarios_emissor
            ON usuarios_emissor.id = transferencias.emissor
        INNER JOIN usuarios AS usuarios_destinatario
            ON usuarios_destinatario.id = transferencias.destinatario
        ORDER BY transferencias.data;`
    );
    res.json(resultado.rows); // Devolve os dados para a página
});

app.post("/cadastro", async function (req, res) {
    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const cpf = req.body.cpf;
    const data_nascimento = req.body.data_nascimento;

    // Insere na tabela transferencias usando os IDs encontrados
    await db.query(
        "INSERT INTO usuarios (nome, sobrenome, cpf, data_nascimento) VALUES ($1, $2, $3, $4)",
        [nome,sobrenome,cpf,data_nascimento]
    );

    res.send("Cadastro realizado com sucesso!"); // Avisa a página que deu certo
});

// Salva uma nova transferência no banco
app.post("/transferencias", async function (req, res) {
    // Pega os valores que vieram do formulário
    const cpfEmissor = req.body.emissor;
    const cpfReceptor = req.body.receptor;
    const valor = req.body.valor;

    // Acha o ID do emissor e do receptor pelo CPF
    const emissor = await db.query("SELECT id FROM usuarios WHERE cpf = $1", [cpfEmissor]);
    const receptor = await db.query("SELECT id FROM usuarios WHERE cpf = $1", [cpfReceptor]);

    // Insere na tabela transferencias usando os IDs encontrados
    await db.query(
        "INSERT INTO transferencias (emissor, destinatario, valor) VALUES ($1, $2, $3)",
        [emissor.rows[0].id, receptor.rows[0].id, valor]
    );

    res.send("Salvo!"); // Avisa a página que deu certo
});