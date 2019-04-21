const IP = '127.0.0.1';
const PORT = 8090;

const express = require('express');
const app = express();
const session = require('express-session');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
//dotenv.load();
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const FuzzySet = require('fuzzyset.js');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
// Load json dataset into memory //
let json_countries = require('./json/countries.json');

const type = function(obj) {
    return Object.prototype.toString.apply(obj).replace(/\[object (.+)\]/i, '$1').toLowerCase();
};

const stripHTML = function(untrusted) {
    return sanitizeHtml(untrusted);
}

// -----------------------------AUTH 0----------------------------- //

var strategy = new Auth0Strategy({
    domain:       'dev-0ut5oehg.eu.auth0.com',
    clientID:     'kMgp-MeVVa7tU6K4BefEuRmB_-ZnJbv6',
    clientSecret: 'iI0HWic0iWNxqiu_AjlSVlWcSLA97hsQACBLtMLq_E1Gd9hkG7vi7dok0CT_XuP8',
    callbackURL:  '/callback'
   },
   function(accessToken, refreshToken, extraParams, profile, done) {
     return done(null, profile);
   }
 );
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
}); 
passport.use(strategy);

app.use(session({
  secret: 'shhhhhhhhh', // change this lmao
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
}

app.get('/login', passport.authenticate('auth0', {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: 'http://localhost:8090/callback',
    responseType: 'code'
}), (req, res) => {
    res.redirect('/admin');
})

app.get('/logout', (req, res) => {
    console.log('Logging out..')
    req.logout();
    res.redirect('/');
})

app.get('/callback', passport.authenticate('auth0',
    {failureRedirect: '/'}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});

app.get('/admin', ensureLoggedIn, (req, res) => {
    console.log('Admin Authenticated');
    res.sendFile(__dirname + '/admin.html');
});

// Secure endpoints json syntax for add/edit //
/*
    index: One index to change

    name_common: One common name
    name_official: One official name
    name_native: One native name

    region: One region
    subregion: One Subregion
    capital: One capital -> array
    currency: Array of currency
    languages: Array of strings -> json of languages
    demonym: One demonym
    independent: true/false/undefined
    translations: array of strings -> json
    flag: unicode code for flag emoji
    latlng: two long array
    borders: array of borders
    landlocked: true/false/undefined
    area: One area, number only
    callingcode: One callingcode, int only
    domain: period followed by letters only
*/

app.post('/add', ensureLoggedIn, (req, res) => {
    // Add Country secure endpoint
    let json_body = req.body;

    let id_list = ['name', 'region', 'subregion', 'capital', 'currency', 'languages', 'demonym', 'independent',
                   'translations', 'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];


    let index = json_countries.length;
    json_countries.push({});


    for (let id = 0; id < id_list.length; id++) {
        let s_id = id_list[id];
        switch(s_id) {
            case 'name': 
                json_countries[index]['name'] = {'common': '', 'official': '', 'native': {}};

                if (stripHTML(json_body['name_common']) === '') {
                    res.statusMessage = '"name_common" field is invalid! (Required field name_common) Additional errors may have occured';
                    res.sendStatus(400);
                } else if (stripHTML(json_body['name_common']) in country_names && stripHTML(json_body['name_common']) != '') {
                    res.statusMessage = '"name_common" field is invalid! (Name already exists) Additional errors may have occured';
                    res.sendStatus(400);
                } else {
                    json_countries[index]['name']['common'] = stripHTML(json_body['name_common']);
                }

                if (stripHTML(json_body['name_official']) in country_names && stripHTML(json_body['name_official']) != '') {
                    res.statusMessage = '"name_official" field is invalid! (Name already exists) Additional errors may have occured';
                    res.sendStatus(400);
                } else {
                    json_countries[index]['name']['official'] = stripHTML(json_body['name_official']);
                }

                if (stripHTML(json_body['name_native']) in country_names && stripHTML(json_body['name_native']) != '') {
                    res.statusMessage = '"name_native" field is invalid! (Name already exists) Additional errors may have occured';
                    res.sendStatus(400);
                } else {
                    json_countries[index]['name']['native'] = {'unknown': {'common': stripHTML(json_body['name_native'])}}; // add support for multiple native
                }
                break;
            case 'capital':
                json_countries[index]['capital'] = [stripHTML(json_body['capital'])];
                break;
            case 'languages':
                if (type(json_body['languages']) === 'array') {
                    json_countries[index]['languages'] = {};
                    for (let i = 0; i < json_body['languages'].length; i++) {
                        json_countries[index]['languages'][i] = stripHTML(json_body['languages'][i]);
                    }
                } else {
                    res.statusMessage = '"languages" field is invalid! (Not an array) Additional errors may have occured.';
                    res.sendStatus(400);
                }
                break;
            case 'latlng':
                if (type(json_body['latlng']) === 'array') {   
                    if (json_body['latlng'].length === 2) {               
                        json_countries[index]['latlng'] = [0, 0];
                        json_countries[index]['latlng'][0] = stripHTML(json_body['latlng'][0]);
                        json_countries[index]['latlng'][1] = stripHTML(json_body['latlng'][1]);
                    } else if (json_body['latlng'] == '') {
                        json_countries[index]['latlng'] = [0,0];
                    } else {
                        res.statusMessage = '"latlng" field is invalid! (Array is not length 2) Additional errors may have occured.';
                        res.sendStatus(400);
                    }
                } else {
                    res.statusMessage = '"latlng" field is invalid! (Not an array) Additional errors may have occured.';
                    res.sendStatus(400);
                }
                break;
            case 'borders':
                if (type(json_body['borders']) === 'array') {
                    for (let b = 0; b < json_body['borders'].length; b++) {
                        json_body['borders'][b] = stripHTML(json_body['borders'][b]);
                        
                    }
                    json_countries[index]['borders'] = json_body['borders'];
                    console.log(json_countries[index]['borders']);
                    if (json_countries[index]['borders'] == '') {
                        json_countries[index]['borders'] = [];
                    }
                } else {
                    res.statusMessage = '"borders" field is invalid! (Not an array) Additional errors may have occured.';
                    res.sendStatus(400);
                }
                break;
            case 'translations':
                if (type(json_body['translations']) === 'array') {
                    json_countries[index]['translations'] = {};
                    for (let i = 0; i < json_body['translations'].length; i++) {
                        json_countries[index]['translations'][i] = {'common': stripHTML(json_body['translations'][i])};
                    }
                } else {
                    res.statusMessage = '"translations" field is invalid! (Not an array) Additional errors may have occured.';
                    res.sendStatus(400);
                }
                break;
            case 'callingcode':
                if (type(json_body['callingcode']) === 'string') {
                    if (json_body['callingcode'] === '') {
                        json_countries[index]['callingCode'] = '';
                    } else if (isNaN(Math.floor(stripHTML(json_body['callingcode'])))) {
                        res.statusMessage = '"callingcode" field is invalid! (Not a number) Additional errors may have occured.';
                        res.sendStatus(400);
                    } else {
                        json_countries[index]['callingCode'] = [Math.floor(stripHTML(json_body['callingcode']))];
                    }
                } else {
                    res.statusMessage = '"callingcode" field is invalid! (Not a number) Additional errors may have occured.';
                    res.sendStatus(400);
                }
            case 'domain':
                if (type(json_body['domain']) === 'string') {
                    json_countries[index]['tld'] = [stripHTML(json_body['domain'])];
                } else {
                    res.statusMessage = '"domain" field is invalid! (Not a string) Additional errors may have occured.';
                    res.sendStatus(400);
                }
            default:
                json_countries[index][s_id] = stripHTML(json_body[s_id]);
        }
    }
    country_names = generate_country_list();
    country_index = generate_country_index();
    fuzz = generate_country_fuzzy(country_names);
});

app.post('/edit', ensureLoggedIn, (req, res) => {
    // Edit Country secure endpoint
    let json_body = req.body;
    let index = json_body['index']

    json_countries[index]['name']['common'] = json_body['name_common'];
    json_countries[index]['name']['official'] = json_body['name_official'];
    json_countries[index]['name']['native'] = {'unknown': {'common': json_body['name_native']}}; // add support for multiple native

    json_countries[index]['region'] = json_body['region'];
    json_countries[index]['subregion'] = json_body['subregion'];
    json_countries[index]['capital'] = [json_body['capital']];
    json_countries[index]['currency'] = json_body['currency'];

    json_countries[index]['languages'] = {};
    for (let i = 0; i < json_body['languages'].length; i++) {
        json_countries[index]['languages'][i] = json_body['languages'][i];
    }

    json_countries[index]['demonym'] = json_body['demonym'];
    json_countries[index]['independent'] = json_body['independent'];

    json_countries[index]['translations'] = {};
    for (let i = 0; i < json_body['translations'].length; i++) {
        json_countries[index]['translations'][i] = {'common': json_body['translations'][i]};
    }

    json_countries[index]['flag'] = json_body['flag'];

    json_countries[index]['latlng'] = [0, 0];
    json_countries[index]['latlng'][0] = json_body['latlng'][0];
    json_countries[index]['latlng'][1] = json_body['latlng'][1];

    json_countries[index]['borders'] = json_body['borders'];
    json_countries[index]['landlocked'] = json_body['landlocked'];
    json_countries[index]['area'] = json_body['area'];
    json_countries[index]['callingCode'] = [json_body['callingcode']];
    json_countries[index]['tld'] = [json_body['domain']];

    country_names = generate_country_list();
    country_index = generate_country_index();
    fuzz = generate_country_fuzzy(country_names);
});

app.get('/search/delete', ensureLoggedIn, (req, res) => {
    // Search Country for delete secure endpoint
    // Returns Common name (maybe index too?)
    let query_name = req.query.name;
    let i = find_country(query_name);
    let actual_name = json_countries[i]['name']['common'];
    res.send({index: i, name: actual_name});
})

app.get('/search/edit', ensureLoggedIn, (req, res) => {
    // Search Country for edit secure endpoint
    // Returns all current data about a country
    
    let query_name = req.query.name;
    let index = find_country(query_name);

    let all = {
        region : true,
        subregion : true,
        capital : true,
        currency : true,
        languages : true,
        demonym : true,
        independent : true,
        translations : true,
        flag : true,
        latlng : true,
        borders : true,
        landlocked : true,
        area : true,
        callingCode : true,
        tld : true
    };

    let statistics = get_country_statistics(index, all);
    statistics['index'] = index;
    res.send(statistics);

})

app.post('/delete', ensureLoggedIn, (req, res) => {
    // Delete country secure endpoint
    // receives json in form, {index: x}
    // delete at index
    try {
        let index = req.body.index;
        json_countries.splice(index, 1);
        country_names = generate_country_list();
        country_index = generate_country_index();
        fuzz = generate_country_fuzzy(country_names);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }

})

// ----------------------------- COUNTRY ----------------------------- //

function generate_country_list() {
    let output_dict = {};
    for (let i = 0; i < json_countries.length; i++) {
        let name = json_countries[i]['name']['official'];
        let native = json_countries[i]['name']['native']
        let names = [json_countries[i]['name']['official'], 
                    json_countries[i]['name']['common']];

        for (let key in native) {
            /*names.push(native[key]['official']);
            names.push(native[key]['common']);*/
            for (let type in native[key]) {
                names.push(native[key][type]);
            }
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
    reduced_country_data['native_name'] = {};
    for (let key in native) {
        /*reduced_country_data['native_name'] = {'common': full_country_data['name']['native'][key]['common'],
                                                'official': full_country_data['name']['native'][key]['official']}*/
        for (let type in native[key]) {
            reduced_country_data['native_name'][type] = full_country_data['name']['native'][key][type];
        }
    }

    for (let key in toggles) {
        if (toggles[key]) { reduced_country_data[key] = full_country_data[key];}
    }
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

app.listen(PORT);

app.use(function (req, resp, next) {
    resp.status(404).send();
});
console.log('Listening on ' + IP + ':' + PORT);