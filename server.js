const app = require('./app');
app.listen(process.env.PORT || 8090);
console.log('Listening on port '+ (process.env.PORT || 8090));