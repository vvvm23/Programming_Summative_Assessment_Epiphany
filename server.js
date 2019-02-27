const express = require('express');
const app = express();

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