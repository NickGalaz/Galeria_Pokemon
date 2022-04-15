const http = require('http');
const fs = require('fs');
const axios = require('axios');
let pokePromesas = [];


// Funciones async con Axios
async function getNombre() {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150')
    return data.results
};
async function getFoto(name) {
    const { data } = await
        axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    return data
};


http
    .createServer((req, res) => {
        if (req.url == '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            fs.readFile('./public/index.html', 'utf8', (err, html) => {
                if (err) throw err;
                res.write(html)
                res.end();
            });
        }
        else if (req.url == '/pokemones') {
            res.writeHead(200, { 'Content-Type': 'text/JSON' })
            getNombre().then((results) => {
                results.forEach((p) => {
                    let pokemonName = p.name
                    pokePromesas.push(getFoto(pokemonName))
                });
                Promise.all(pokePromesas).then((data) => {
                    let pokemones = []
                    data.forEach((p) => {
                        let img = p.sprites.front_default
                        let nombre = p.name
                        pokemones.push({ img, nombre })
                    });
                    res.write(JSON.stringify(pokemones))
                    res.end();
                });
            }).catch(e => console.log(e));
        }else {
            res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' })
            res.end('Recurso no encontrado');
        };
    })
    .listen(3000, () => console.log('Credenciales correctas'))

