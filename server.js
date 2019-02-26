function modal_error() {
    $('.ui.modal').modal('show');
}

const express = require('express');
const app = express();

app.use(express.static('client'));

app.get('/', function (req, resp) { 

});

app.get('/query', function (req, resp) {

});

app.listen(8090);

app.use(function (req, resp, next) {
    resp.status(404).send();
});
console.log('Listening on 127.0.0.1:8090');