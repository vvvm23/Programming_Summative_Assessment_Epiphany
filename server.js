const express = require('express');
const app = express();

// Load json dataset into memory //
let json_abbreviation = require('./json/country-by-abbreviation.json');
let json_average_height = require('./json/country-by-avg-male-height.json');
let json_calling_code = require('./json/country-by-calling-code.json');
let json_capital_city = require('./json/country-by-capital-city.json');
let json_continent = require('./json/country-by-continent.json');
let json_coastline = require('./json/country-by-costline.json');
let json_currency_code = require('./json/country-by-currency-code.json');
let json_currency_name = require('./json/country-by-currency-name.json');
let json_domain = require('./json/country-by-domain-tld.json');
let json_elevation = require('./json/country-by-elevation.json');
let json_flag = require('./json/country-by-flag.json');
let json_coordinates = require('./json/country-by-geo-coordinates.json');
let json_government_type = require('./json/country-by-government-type.json');
let json_independance = require('./json/country-by-independence-date.json');
let json_landlocked = require('./json/country-by-landlocked.json');
let json_languages = require('./json/country-by-languages.json');
let json_life_expectancy = require('./json/country-by-life-expectancy.json');
let json_national_dish = require('./json/country-by-national-dish.json');
let json_population_density = require('./json/country-by-population-density.json');
let json_population = require('./json/country-by-population.json');
let json_region = require('./json/country-by-region-in-world.json');
let json_area = require('./json/country-by-surface-area.json');
let json_temperature = require('./json/country-by-yearly-average-temperature.json');

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