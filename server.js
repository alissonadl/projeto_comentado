const express = require("express");
const db = require("./bd");
const app = express();

app.use(express.static(__dirname)); // Permite abrir seus arquivos HTML e CSS no navegador
app.use(express.json()); // Permite o servidor ler os dados enviados pelo formulário

// Busca as transferências para mostrar na tela
app.get("/transferencias", async function (req, res) {
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
    res.json(resultado.rows); // Devolve os dados para a página
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

    // Se algum CPF não existir, avisa e para por aqui
    if (emissor.rows.length === 0 || receptor.rows.length === 0) {
        res.send("Um dos CPFs não foi encontrado encontrado!");
        return;
    }

    // Insere na tabela transferencias usando os IDs encontrados
    await db.query(
        "INSERT INTO transferencias (emissor, destinatario, valor) VALUES ($1, $2, $3)",
        [emissor.rows[0].id, receptor.rows[0].id, valor]
    );

    res.send("Salvo!"); // Avisa a página que deu certo
});

app.listen(3000, function () {
    console.log("Servidor rodando na porta 3000"); // Liga o servidor
});