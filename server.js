const express = require('express');
const app = express();

// Load json dataset into memory //

let json_countries = require('./json/countries.json');

function find_country(name) {
    // Map to closet country name
    // Then find index in json_name and return
}

function get_country_statistics(index) {
    // maybe perform additional processing here
    // ..or process on client side
    return json_countries[index];
}

console.log(get_country_statistics(123));

app.use(express.static('client'));

app.get('/', function (req, resp) { 
    // Homepage, should automatically get index.html
    
});

app.get('/query', function (req, resp) {
    // Query in memory JSON
    let i = req.query.i;
});

app.get('/wiki', function (req, resp) {
    // Query wikipedia API
})

app.get('/admin', function (req, resp) {
    resp.redirect('127.0.0.1:8090/admin.html')
})

app.listen(8090);

app.use(function (req, resp, next) {
    resp.status(404).send();
});
console.log('Listening on 127.0.0.1:8090');