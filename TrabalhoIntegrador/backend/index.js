const express = require('express');

const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.listen(3001, ()=> {console.log('servidor rodando')});

server.get('/', (req, res) => { //callback
    res.send('Hello World');
}); 

server.post('/cadastro', (req, res) => {
    const nome = req.body.funcionario;
    const cod = req.body.id;
    const cargo = req.body.cargo;
    const senha = req.body.senha;
    res.send(`${senha}`);
});

server.post('/login', (req, res) => {
    const cod = req.body.id;
    const senha = req.body.senha;
    res.send(`${senha}`);
});

server.post('/solicitacoes-pendentes', (req, res) => {
    const nome = req.body.proprietario;
    const tipo = req.body.tipo;
    const placa = req.body.placa;
    const volume = req.body.volume;
    const compartimentos = req.body.compartimentos;
    const setas = req.body.setas;
    const telefone = req.body.telefone;
    const email = req.body.email;
    res.send(`Proprietário: ${nome}</br>
            Tipo: ${tipo}</br>
            Placa: ${placa}</br>
            Volume: ${volume}</br>
            Compartimentos: ${compartimentos}</br>
            Setas: ${setas}</br>
            Telefone: ${telefone}</br>
            E-mail: ${email}</br>
            `)
});

server.post('/agenda', (req, res) => {
    const data = req.body.data;
    res.send(`${}`)
});