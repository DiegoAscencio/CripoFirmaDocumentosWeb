"user strict";

const express = require('express');
const fs = require('fs');
var https = require('https');
const app = express();
const port = 3000;

let users = JSON.parse(fs.readFileSync('users.json'));

app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

//Crea una ruta raíz
app.get('/', (req, res) => {
    res.send('Pagina web');
})

app.route('/api/login')
    .get((req, res) => {
        res.send("Seccion de login");
    })
    .post((req, res) => {
        let {
            email,
            password
        } = req.body;
        let usr = {
            email,
            password
        };

        //1. Si falta alguno de los atributos regresar el error correspondiente con el mensaje de lo
        //que falta. 
        let str = "";
        for (k in usr) {
            if (usr[k] == '') {
                str += "Te falta: " + k + "\n";
            }
        }
        if (str.length > 0)
            res.status(400).send(str)

        //2. Obten el valor del correo y del password y busca que alguno de los usuarios lo tenga
        //de lo contrario regresa un error (401) con un mensaje.
        str = "";
        for (k in users) {
            if (users[k].email == email && users[k].password == password) {
                res.status(200).send(JSON.stringify(usr));
                return;
            }
        }
        res.status(401).send("Usuario o contraseña incorrectos");
    });

app.route('/api/users/:email')
    .get((req, res) => {
        res.send("GET del usuario:" + req.params.email);
    })

    .put((req, res) => {

        let oldUsr = users.find((e) => {
            return e.email == req.params.email;
        })

        let {
            email,
            password
        } = req.body;
        let usr = {
            email,
            password
        };

        let str = "";
        for (k in usr) {
            if (usr[k] == '' && k != 'url') {
                str += "Te falta: " + k + "\n";
            }
        }
        if (str.length > 0)
            res.status(400).send(str)

        users.forEach(element => {
            if (element.id == oldUsr.id) {
                Object.assign(element, usr);
                usr = element;
            }
        });

        res.status(201).send(usr);
        fs.writeFileSync('users.json', JSON.stringify(users));
    })

https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app)
    .listen(port, function () {
        console.log('Running on port 3000. Go to https://localhost:3000/')
    })