const express = require('express');
const app = express();

app.use(express.static('client'));

app.get('/', function (req, resp) { 

});

app.listen(8090);

app.use(function (req, resp, next) {
    resp.status(404);
    resp.redirect("404.html");
});
console.log('Listening on 127.0.0.1:8090');