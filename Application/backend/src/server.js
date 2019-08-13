//Importar o express.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

//Cria o servidor express responsável por gerenciar todas as rotas.
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const {user} = socket.handshake.query;

    connectedUsers[user] = socket.id;
});

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-c0uz9.mongodb.net/omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

//Permite que aplicação seja acessada.
app.use(cors());
//Configurar o server para entender JSON.
app.use(express.json());

//Informar o que a API deve fazer ao receber uma requisição em uma determinada rota.
app.use(routes);

//Rodar o servidor node na porta desejada.
server.listen(3333);