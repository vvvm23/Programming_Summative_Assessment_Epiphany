const IP = '127.0.0.1';
const PORT = 8090;

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const FuzzySet = require('fuzzyset.js');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// Load json dataset into memory //
let json_countries = require('./json/countries.json');

function generate_country_list() {
    let output_dict = {};
    for (let i = 0; i < json_countries.length; i++) {
        let name = json_countries[i]['name']['official'];
        let native = json_countries[i]['name']['native']
        let names = [json_countries[i]['name']['official'], 
                    json_countries[i]['name']['common']];

        for (let key in native) {
            names.push(native[key]['official']);
            names.push(native[key]['common']);
        }

        for (let n in names) {
            output_dict[names[n]] = name;
        }
    }
    return output_dict;
}

function generate_country_index() {
    let output_dict = {};
    for (let i = 0; i < json_countries.length; i++) {
        let name = json_countries[i]['name']['official'];
        output_dict[name] = i;
    }
    return output_dict;
}

function generate_country_fuzzy(country_list) {
    let output_array = [];
    for (let key in country_list) {
        output_array.push(key);
    }
    return FuzzySet(output_array);
}

let country_names = generate_country_list();
let country_index = generate_country_index();

let fuzz = generate_country_fuzzy(country_names);

function find_country(name) {
    // Map to closest country name
    // Then find index in json_name and return
    // Match with altSpellings and name fields
    // Either regex match then select or first 
    
    // If nothing matches the array will be empty, be sure to add handlers for this
    let fuzz_result = fuzz.get(name);
    console.log(fuzz_result);
    return country_index[country_names[fuzz_result[0][1]]];
}

function get_country_statistics(index, toggles) {
    // Toggles: List of T/F values corresponding to each field
    // maybe perform additional processing here
    // ..or process on client side

    // Return based on query url parameters

    let full_country_data = json_countries[index];
    let reduced_country_data = {};
    // pick data here

    reduced_country_data['name'] = full_country_data['name'];
    let native = full_country_data['name']['native']
    for (let key in native) {
        reduced_country_data['native_name'] = {'common': full_country_data['name']['native'][key]['common'],
                                                'official': full_country_data['name']['native'][key]['official']}
    }

    for (let key in toggles) {
        if (toggles[key]) { reduced_country_data[key] = full_country_data[key];}
    }
    console.log(reduced_country_data);
    return reduced_country_data;
}

function get_map(settings) {
    const APP_ID = "RUw2eiQLvRoOmpWww3e7";
    const APP_CODE = "Jd2W3CtG6MJl0OL-LBoLAg";
    let url = "https://image.maps.api.here.com/mia/1.6/mapview?"
    url = url + "app_id=" + APP_ID + "&app_code=" + APP_CODE;
    url = url + "&lat=" + settings['lat'];
    url = url + "&lon=" + settings['lon'];
    url = url + "&z=" + settings['zoom'];
    url = url + "&w=" + settings['image_width'];
    url = url + "&h=" + settings['image_height'];
    url = url + "&t=" + settings['image_type'];
    console.log(url);
    return url;
}

app.use(express.static('client'));

app.get('/', function (req, resp) { 
    // Homepage, should automatically get index.html
});

app.get('/query', function (req, resp) {
    let check_string = req.query.check;
    let check = {
        region : check_string.charAt(0) == '1' ? true:false,
        subregion : check_string.charAt(1) == '1' ? true:false,
        capital : check_string.charAt(2) == '1' ? true:false,
        currency : check_string.charAt(3) == '1' ? true:false,
        languages : check_string.charAt(4) == '1' ? true:false,
        demonym : check_string.charAt(5) == '1' ? true:false,
        independent : check_string.charAt(6) == '1' ? true:false,
        translations : check_string.charAt(7) == '1' ? true:false,
        flag : check_string.charAt(8) == '1' ? true:false,
        latlng : true,
        borders : check_string.charAt(10) == '1' ? true:false,
        landlocked : check_string.charAt(11) == '1' ? true:false,
        area : check_string.charAt(12) == '1' ? true:false,
        callingCode : check_string.charAt(13) == '1' ? true:false,
        tld : check_string.charAt(14) == '1' ? true:false
    };
    let query_name = req.query.name;
    let index = find_country(query_name);
    let statistics = get_country_statistics(index, check);
    
    resp.send(statistics);
});

app.get('/wiki', function (req, resp) {
    // Query wikipedia API
    // Take Official Name of country as input
    let name = req.query.name;
    fetch('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=' + name)
    .then(resp => resp.json())
    .then(function(wiki_json) {
        let page_json = wiki_json['query']['pages'];
        let output = {};
        for (let key in page_json) {
            output = page_json[key]['extract']
        }

        resp.send({'wiki': output});
    })
    .catch()
})

app.get('/map', function (req, resp) {
    // Query here maps API
    // maybe simply send selected country index rather than lat lon
    let lat = req.query.lat;
    let lon = req.query.lon;
    let dim_y = req.query.y;
    let dim_x = req.query.x;
    let z = req.query.z;
    let t = req.query.t;

    resp.send({map_url: get_map({
        'lat' : req.query.lat,
        'lon' : req.query.lon,
        'zoom' : req.query.z,
        'image_width' : req.query.x,
        'image_height' : req.query.y,
        'image_type' : req.query.t
    })});
})

app.get('/admin', function (req, resp) {
    resp.redirect(IP+':'+PORT+'/admin.html')
})

app.listen(PORT);

app.use(function (req, resp, next) {
    resp.status(404).send();
});
console.log('Listening on ' + IP + ':' + PORT);