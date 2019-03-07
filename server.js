const express = require('express');
const app = express();

// Load json dataset into memory //

let json_countries = require('./json/countries.json');

function find_country(name) {
    // Map to closest country name
    // Then find index in json_name and return
    // Match with altSpellings and name fields
    // Either regex match then select or first hit
}

function get_country_statistics(index, toggles) {
    // Toggles: List of T/F values corresponding to each field
    // maybe perform additional processing here
    // ..or process on client side

    /*  Returns - Make toggleable
        Name: common, official, native
        Domain
        Independance
        Currency
        Calling Code
        Capital
        Region
        Subregion
        Languages
        Translations
        LatLng
        People's Name
        Landlocked
        Borders
        Surface Area
        Flag Emoji
    */
    // Return based on query url parameters

    return json_countries[index];
}

console.log(get_country_statistics(124, []));

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

app.get('/map', function (req, resp) {
    // Query here maps API
    // maybe simply send selected country index rather than lat lon
    let lat = req.query.lat;
    let lon = req.query.lon;
    let dim_y = req.query.y;
    let dim_x = req.query.x;
    let z = req.query.z;

    resp.send({map_url: "https://image.maps.api.here.com/mia/1.6/mapview?app_id=RUw2eiQLvRoOmpWww3e7&app_code=Jd2W3CtG6MJl0OL-LBoLAg&lat="+lat+"&lon="+lon+"&z="+z+"&w="+dim_x+"&h="+dim_y});
})

app.get('/admin', function (req, resp) {
    resp.redirect('127.0.0.1:8090/admin.html')
})

app.listen(8090);

app.use(function (req, resp, next) {
    resp.status(404).send();
});
console.log('Listening on 127.0.0.1:8090');