const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const usuarios = require("./dummy");
const { exec } = require('child_process');
const { stderr, stdout } = require('process');

const app = express();


//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//CORS

//Rutass
app.get('/', (req, res)=>{
    res.status(200).send('<div><h1>Hola mundo!</h1> <p>esp32 y aws<p> <div>');
});

app.get('/homepage', (req, res) =>{
    res.sendFile(path.join(__dirname+'/index.html'));
})

const data = {
    message: 'datos',
    payload: {
        temperatura: '20',
        presion: '1'
    }
}

console.log(usuarios);

/*
app.get('/data', (req, res)=> {
    res.status(200).send(data);
}); */

app.get('/data', (req, res)=> {
    res.status(200).send(usuarios.sort((a, b) => {return a.id-b.id}));
})

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    var user = {}
    for (let u of usuarios){
        if(u.id == id){
            user = u;
        }
    }



    res.status(200).send(comprimirCadena(usuarios.clave));
})

const comprimirCadena = (cadena) => {
    
    var cRef = '';
    var contador = 0;
    var contadorCadena = 0;
    var nuevaCadena = '';

    for(let c of cadena) {
        contadorCadena = contadorCadena + 1;
        if(c === cRef){
            contador = contador +1;
        }
        else{
            nuevaCadena = nuevaCadena + cRef ;
            if (c !== '' && contador > 0 ) nuevaCadena = nuevaCadena + String(contador+1);
            cRef = c;
            contador = 0;
        }
        if(contadorCadena === cadena.length){
            nuevaCadena = nuevaCadena + c;
            if(c !== '' && contados > 0) nuevaCadena = nuevaCadena + String(contador+1);
        }
    }
    return nuevaCadena;
}

app.get('/publish', (req, res) => {
    exec("aws --region us-east-1 iot-data publish --topic 'inTopic' --cli-binary-format raw-in-base64-out --payload 'Hello World'", (error, stdout, stderr) =>{
        if(error){
            res.status(200).send(error)
        }
        if(stderr){
            res.status(200).send(stderr)
        }
        res.status(200).send("Enviado correctamente");
    });
});

module.exports = app;