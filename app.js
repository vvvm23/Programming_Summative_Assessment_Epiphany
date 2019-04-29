// Import needed packages
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');

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

// Function to determine type of object
const type = function(obj) {
    return Object.prototype.toString.apply(obj).replace(/\[object (.+)\]/i, '$1').toLowerCase();
};

// Wrapper function to strip HTML from a string
const stripHTML = function(untrusted) { return sanitizeHtml(untrusted); };

// -----------------------------AUTH 0----------------------------- //

// Define auth0 strategy
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
    secret: 'zWMZ7OLaf2fM', //'shhhhhhhhh
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
};

app.get('/login', passport.authenticate('auth0', {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: 'http://localhost:8090/callback',
    responseType: 'code'
}), (req, res) => {
    res.redirect('/admin');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/callback', passport.authenticate('auth0',
    {failureRedirect: '/'}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});

// When requesting admin page, send html for it
app.get('/admin', ensureLoggedIn, (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.post('/add', ensureLoggedIn, (req, res) => {
    // Add Country secure endpoint
    try {    
        let json_body = req.body;
        let id_list = ['name', 'region', 'subregion', 'capital', 'currency', 'languages', 'demonym', 'independent',
            'translations', 'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];


        let index = json_countries.length;
        json_countries.push({}); // Add empty object to end of json_countries

        const restore = function() {json_countries.splice(index, 1);}; // Restore function in case of error

        // Iterate through ids and handle special cases to add new entry to json_countries
        for (let id = 0; id < id_list.length; id++) {
            let s_id = id_list[id];
            switch(s_id) {
            case 'name': 
                json_countries[index]['name'] = {'common': '', 'official': '', 'native': {}};

                if (stripHTML(json_body['name_common']) === '') {
                    restore();
                    res.statusMessage = '"name_common" field is invalid! (Required field name_common) Additional errors may have occured';
                    return res.sendStatus(400);
                } else if (stripHTML(json_body['name_common']) in country_names && stripHTML(json_body['name_common']) != '') {
                    restore();
                    res.statusMessage = '"name_common" field is invalid! (Name already exists) Additional errors may have occured';
                    return res.sendStatus(400);
                } else {
                    json_countries[index]['name']['common'] = stripHTML(json_body['name_common']);
                }

                if (stripHTML(json_body['name_official']) in country_names && stripHTML(json_body['name_official']) != '') {
                    restore();
                    res.statusMessage = '"name_official" field is invalid! (Name already exists) Additional errors may have occured';
                    return res.sendStatus(400);
                } else {
                    json_countries[index]['name']['official'] = stripHTML(json_body['name_official']);
                }

                if (stripHTML(json_body['name_native']) in country_names && stripHTML(json_body['name_native']) != '') {
                    restore();
                    res.statusMessage = '"name_native" field is invalid! (Name already exists) Additional errors may have occured';
                    return res.sendStatus(400);
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
                    restore();
                    res.statusMessage = '"languages" field is invalid! (Not an array) Additional errors may have occured.';
                    return res.sendStatus(400);
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
                        restore();
                        res.statusMessage = '"latlng" field is invalid! (Array is not length 2) Additional errors may have occured.';
                        return res.sendStatus(400);
                    }
                } else {
                    restore();
                    res.statusMessage = '"latlng" field is invalid! (Not an array) Additional errors may have occured.';
                    return res.sendStatus(400);
                }
                break;
            case 'borders':
                if (type(json_body['borders']) === 'array') {
                    for (let b = 0; b < json_body['borders'].length; b++) {
                        json_body['borders'][b] = stripHTML(json_body['borders'][b]);
                            
                    }
                    json_countries[index]['borders'] = json_body['borders'];
                    if (json_countries[index]['borders'] == '') {
                        json_countries[index]['borders'] = [];
                    }
                } else {
                    restore();
                    res.statusMessage = '"borders" field is invalid! (Not an array) Additional errors may have occured.';
                    return res.sendStatus(400);
                }
                break;
            case 'translations':
                if (type(json_body['translations']) === 'array') {
                    json_countries[index]['translations'] = {};
                    for (let i = 0; i < json_body['translations'].length; i++) {
                        json_countries[index]['translations'][i] = {'common': stripHTML(json_body['translations'][i])};
                    }
                } else {
                    restore();
                    res.statusMessage = '"translations" field is invalid! (Not an array) Additional errors may have occured.';
                    return res.sendStatus(400);
                }
                break;
            case 'callingcode':
                if (type(json_body['callingcode']) === 'string') {
                    if (json_body['callingcode'] === '') {
                        json_countries[index]['callingCode'] = '';
                    } else if (isNaN(Math.floor(stripHTML(json_body['callingcode'])))) {
                        restore();
                        res.statusMessage = '"callingcode" field is invalid! (Not a number) Additional errors may have occured.';
                        return res.sendStatus(400);
                    } else {
                        json_countries[index]['callingCode'] = [Math.floor(stripHTML(json_body['callingcode']))];
                    }
                } else {
                    restore();
                    res.statusMessage = '"callingcode" field is invalid! (Not a number) Additional errors may have occured.';
                    return res.sendStatus(400);
                }
                break;
            case 'domain':
                if (type(json_body['domain']) === 'string') {
                    json_countries[index]['tld'] = [stripHTML(json_body['domain'])];
                } else {
                    restore();
                    res.statusMessage = '"domain" field is invalid! (Not a string) Additional errors may have occured.';
                    return res.sendStatus(400);
                }
                break;
            default:
                json_countries[index][s_id] = stripHTML(json_body[s_id]);
            }
        }

        // Update name list, index mapping and fuzzySet
        country_names = generate_country_list();
        country_index = generate_country_index();
        fuzz = generate_country_fuzzy(country_names);
        res.send({'name': json_body['name_common']}); // Return original name for label on client to display
    } catch (err) {
        res.statusMessage = 'Failed to add entry! (Unknown)';
        return res.sendStatus(400);
    }
});

app.post('/edit', ensureLoggedIn, (req, res) => {
    // Edit Country secure endpoint
    try {    
        let json_body = req.body;
        let index = json_body['index'];

        let restore_state = JSON.parse(JSON.stringify(json_countries[index])); // Save restore state
        const restore = function() {json_countries[index] = restore_state;}; // Restore function in case of error

        let original_name = json_countries[index]['name']['common'];

        let id_list = ['name', 'region', 'subregion', 'capital', 'currency', 'languages', 'demonym', 'independent',
            'translations', 'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];


        // Iterate through ids and handle special cases to add new entry to json_countries
        for (let id = 0; id < id_list.length; id++) {
            let s_id = id_list[id];

            switch(s_id) {
            case 'name': 
                if (stripHTML(json_body['name_common']) === '') {
                    restore();
                    res.statusMessage = '"name_common" field is invalid! (Required field name_common) Additional errors may have occured';
                    return res.sendStatus(400);
                } else if (stripHTML(json_body['name_common']) in country_names
                                && stripHTML(json_body['name_common']) != ''
                                && stripHTML(json_body['name_common']) != json_countries[index]['name']['common']) {
                    restore();
                    res.statusMessage = '"name_common" field is invalid! (Name already exists) Additional errors may have occured';
                    return res.sendStatus(400);
                } else {
                    json_countries[index]['name']['common'] = stripHTML(json_body['name_common']);
                }

                if (stripHTML(json_body['name_official']) in country_names 
                        && stripHTML(json_body['name_official']) != ''
                        && stripHTML(json_body['name_official']) != json_countries[index]['name']['official']) {
                    restore();
                    res.statusMessage = '"name_official" field is invalid! (Name already exists) Additional errors may have occured';
                    return res.sendStatus(400);
                } else {
                    json_countries[index]['name']['official'] = stripHTML(json_body['name_official']);
                }

                // hmm
                json_countries[index]['name']['native'] = {'unknown': {'common': stripHTML(json_body['name_native'])}}; // add support for multiple native
                    
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
                    restore();
                    res.statusMessage = '"languages" field is invalid! (Not an array) Additional errors may have occured.';
                    return res.sendStatus(400);
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
                        restore();
                        res.statusMessage = '"latlng" field is invalid! (Array is not length 2) Additional errors may have occured.';
                        return res.sendStatus(400);
                    }
                } else {
                    restore();
                    res.statusMessage = '"latlng" field is invalid! (Not an array) Additional errors may have occured.';
                    return res.sendStatus(400);
                }
                break;
            case 'borders':
                if (type(json_body['borders']) === 'array') {
                    for (let b = 0; b < json_body['borders'].length; b++) {
                        json_body['borders'][b] = stripHTML(json_body['borders'][b]);
                            
                    }
                    json_countries[index]['borders'] = json_body['borders'];
                    if (json_countries[index]['borders'] == '') {
                        json_countries[index]['borders'] = [];
                    }
                } else {
                    restore();
                    res.statusMessage = '"borders" field is invalid! (Not an array) Additional errors may have occured.';
                    return res.sendStatus(400);
                }
                break;
            case 'translations':
                if (type(json_body['translations']) === 'array') {
                    json_countries[index]['translations'] = {};
                    for (let i = 0; i < json_body['translations'].length; i++) {
                        json_countries[index]['translations'][i] = {'common': stripHTML(json_body['translations'][i])};
                    }
                } else {
                    restore();
                    res.statusMessage = '"translations" field is invalid! (Not an array) Additional errors may have occured.';
                    return res.sendStatus(400);
                }
                break;
            case 'callingcode':
                if (type(json_body['callingcode']) === 'string') {
                    if (json_body['callingcode'] === '') {
                        json_countries[index]['callingCode'] = '';
                    } else if (isNaN(Math.floor(stripHTML(json_body['callingcode'])))) {
                        restore();
                        res.statusMessage = '"callingcode" field is invalid! (Not a number) Additional errors may have occured.';
                        return res.sendStatus(400);
                    } else {
                        json_countries[index]['callingCode'] = [Math.floor(stripHTML(json_body['callingcode']))];
                    }
                } else {
                    restore();
                    res.statusMessage = '"callingcode" field is invalid! (Not a number) Additional errors may have occured.';
                    return res.sendStatus(400);
                }
                break;
            case 'domain':
                if (type(json_body['domain']) === 'string') {
                    json_countries[index]['tld'] = [stripHTML(json_body['domain'])];
                } else {
                    restore();
                    res.statusMessage = '"domain" field is invalid! (Not a string) Additional errors may have occured.';
                    return res.sendStatus(400);
                }
                break;
            default:
                json_countries[index][s_id] = stripHTML(json_body[s_id]);
            }
        }

        // Update name list, index mapping and fuzzySet
        country_names = generate_country_list();
        country_index = generate_country_index();
        fuzz = generate_country_fuzzy(country_names);

        res.send({'name': original_name}); // Return original name for displaying on client side
    } catch(err) {
        res.statusMessage = 'Failed to edit entry! (Unknown)';
        return res.sendStatus(400);
    }
});

app.get('/search/delete', ensureLoggedIn, (req, res) => {
    // Search Country for delete secure endpoint
    let query_name = req.query.name;
    if (query_name == null) {
        res.statusMessage = 'Name missing!';
        return res.sendStatus(400);   
    }

    let i = find_country(query_name); // Find closest match

    if (i instanceof Error) {
        res.statusMessage = 'Country not found';
        return res.sendStatus(400);
    }
    let actual_name = json_countries[i]['name']['common'];
    res.send({index: i, name: actual_name}); // Returns index and actual name of country found
});

app.get('/search/edit', ensureLoggedIn, (req, res) => {
    // Search Country for edit secure endpoint
    // Returns all current data about a country
    
    let query_name = req.query.name;

    if (!query_name) {
        res.statusMessage = 'No name specified';
        return res.sendStatus(400);
    }

    let index = find_country(query_name); // Find closest country to query_name

    if (index instanceof Error) {
        res.statusMessage = 'Country not found';
        return res.sendStatus(400);
    }

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

    let statistics = get_country_statistics(index, all); // Get all data on found country
    statistics['index'] = index; // Add index
    res.send(statistics); // Send all data and index back to client

});

app.post('/delete', ensureLoggedIn, (req, res) => {
    // Delete country secure endpoint
    try {
        let index = req.body.index;
        if (index == null) {
            res.statusMessage = 'Failed to delete entry! (Index was null)';
            return res.sendStatus(400);
        } else if (isNaN(index)) {
            res.statusMessage = 'Failed to delete entry! (Index was NaN)';
            return res.sendStatus(400);
        } else if (index < 0 || index > json_countries.length - 1) {
            res.statusMessage = 'Failed to delete entry! (Index out of range)';
            return res.sendStatus(400);
        }
        let original_name = json_countries[index]['name']['common'];
        json_countries.splice(index, 1); // Remove entry at index
        // Update name list, index mapping, fuzzySet
        country_names = generate_country_list();
        country_index = generate_country_index();
        fuzz = generate_country_fuzzy(country_names);
        res.send({name: original_name}); // Send original name back for displaying on client side
    } catch (error) {
        res.statusMessage = 'Failed to delete entry! (Unknown)';
        res.sendStatus(400);
    }

});

// ----------------------------- COUNTRY ----------------------------- //

// Generate list of mapping from country names to official name
function generate_country_list() {
    let output_dict = {};
    for (let i = 0; i < json_countries.length; i++) {
        let name = json_countries[i]['name']['official'];
        let native = json_countries[i]['name']['native'];
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

// Generate list of mappings from name to index in json_countries
function generate_country_index() {
    let output_dict = {};
    for (let i = 0; i < json_countries.length; i++) {
        let name = json_countries[i]['name']['official'];
        output_dict[name] = i;
    }
    return output_dict;
}

// Generate fuzzySet from namelist
function generate_country_fuzzy(country_list) {
    let output_array = [];
    for (let key in country_list) {
        output_array.push(key);
    }
    return FuzzySet(output_array);
}

// Generate name list, index mapping and fuzzySet on server start
let country_names = generate_country_list();
let country_index = generate_country_index();
let fuzz = generate_country_fuzzy(country_names);

function find_country(name) {
    // Map to closest country name
    // Then find index in json_name and return
    // Match with altSpellings and name fields
    // Either regex match then select or first 
    
    let fuzz_result = fuzz.get(name);
    try {
        return country_index[country_names[fuzz_result[0][1]]];
    } catch (error) {
        return error;
    }
}

function get_country_statistics(index, toggles) {
    // Get statistics about a country (by index) only returning data defined by toggles
    let full_country_data = json_countries[index];
    let reduced_country_data = {};

    // Add english names
    reduced_country_data['name'] = full_country_data['name'];

    // Add native name
    let native = full_country_data['name']['native'];
    reduced_country_data['native_name'] = {};
    for (let key in native) {
        for (let type in native[key]) {
            reduced_country_data['native_name'][type] = full_country_data['name']['native'][key][type];
        }
    }

    // Add toggle data
    for (let key in toggles) {
        if (toggles[key]) { reduced_country_data[key] = full_country_data[key];}
    }
    return reduced_country_data;
}

// Constructs url for map API
function get_map(settings) {
    const APP_ID = 'RUw2eiQLvRoOmpWww3e7';
    const APP_CODE = 'Jd2W3CtG6MJl0OL-LBoLAg';
    let url = 'https://image.maps.api.here.com/mia/1.6/mapview?';
    url = url + 'app_id=' + APP_ID + '&app_code=' + APP_CODE;
    url = url + '&lat=' + settings['lat'];
    url = url + '&lon=' + settings['lon'];
    url = url + '&z=' + settings['zoom'];
    url = url + '&w=' + settings['image_width'];
    url = url + '&h=' + settings['image_height'];
    url = url + '&t=' + settings['image_type'];
    return url;
}

app.use(express.static('client'));

app.get('/query', function (req, resp) { 
    // Query end point, returns all data about a country based on toggles    
    let check_string = req.query.check;
    if (check_string == null) {
        resp.statusMessage = 'Check string was empty!';
        return resp.sendStatus(400);
    }

    if (check_string.length != 15) {
        resp.statusMessage = 'Check String of incorrect length!';
        return resp.sendStatus(400);
    }

    // Parse boolean values from binary check string
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
        latlng : true, // Always return latlng, even if not displayed, for mapping
        borders : check_string.charAt(10) == '1' ? true:false,
        landlocked : check_string.charAt(11) == '1' ? true:false,
        area : check_string.charAt(12) == '1' ? true:false,
        callingCode : check_string.charAt(13) == '1' ? true:false,
        tld : check_string.charAt(14) == '1' ? true:false
    };  
    let query_name = req.query.name;
    if (query_name == null) {
        resp.statusMessage = 'Query name was empty!';
        return resp.sendStatus(400);
    }
    let index = find_country(query_name); // Find closest match to query string

    if (index instanceof Error) {
        resp.statusMessage = 'Country does not exist!';
        resp.sendStatus(400);
    } else {
        let statistics = get_country_statistics(index, check); // Get statistics for country
        resp.send(statistics); // Send object back to client
    }
});

app.get('/wiki', function (req, resp) {
    // Query wikipedia API
    // Take Official Name of country as input
    let name = req.query.name;
    if (name == null) {
        resp.statusMessage = 'Name was missing!';
        return resp.sendStatus(400);
    }
    // Fetch from wikipedia API
    fetch('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=' + name)
        .then(function(resp) {
            if (resp.ok) {
                return resp;
            } else {
                throw '';
            }
        })
        .then(resp => resp.json())
        .then(function(wiki_json) {
            let page_json = wiki_json['query']['pages'];
            let output = {};
            for (let key in page_json) {
                output = page_json[key]['extract'];
            }

            resp.send({'wiki': output}); // Return only relevant data for client
        })
        .catch(() => {
            resp.statusMessage = 'Failed to fetch from wikipedia';
            return resp.sendStatus(400);
        });
});

app.get('/map', function (req, resp) {
    // Query here maps API
    let lat = req.query.lat;
    if (lat == null) {
        resp.statusMessage = '"lat" field is invalid! (Null field)';
        return resp.sendStatus(400);
    } else if (isNaN(lat)) {
        resp.statusMessage = '"lat" field is invalid! (Not a number)';
        return resp.sendStatus(400);
    }

    let lon = req.query.lon;
    if (lon == null) {
        resp.statusMessage = '"lon" field is invalid! (Null field)';
        return resp.sendStatus(400);
    } else if (isNaN(lon)) {
        resp.statusMessage = '"lon" field is invalid! (Not a number)';
        return resp.sendStatus(400);
    }

    let dim_y = req.query.y;
    if (dim_y == null) {
        resp.statusMessage = '"dim_y" field is invalid! (Null field)';
        return resp.sendStatus(400);
    } else if (isNaN(dim_y)) {
        resp.statusMessage = '"dim_y" field is invalid! (Not a number)';
        return resp.sendStatus(400);
    } else if (dim_y <= 0) {
        resp.statusMessage = '"dim_y" field is invalid! (Less than 1)';
        return resp.sendStatus(400);
    }

    let dim_x = req.query.x;
    if (dim_x == null) {
        resp.statusMessage = '"dim_x" field is invalid! (Null field)';
        return resp.sendStatus(400);
    } else if (isNaN(dim_x)) {
        resp.statusMessage = '"dim_x" field is invalid! (Not a number)';
        return resp.sendStatus(400);
    } else if (dim_x <= 0) {
        resp.statusMessage = '"dim_x" field is invalid! (Less than 1)';
        return resp.sendStatus(400);
    }

    let z = req.query.z;
    if (z == null) {
        resp.statusMessage = '"z" field is invalid! (Null field)';
        return resp.sendStatus(400);
    } else if (isNaN(z)) {
        resp.statusMessage = '"z" field is invalid! (Not a number)';
        return resp.sendStatus(400);
    } else if (z <= 0) {
        resp.statusMessage = '"z" field is invalid! (Less than 1)';
        return resp.sendStatus(400);
    }

    let t = req.query.t;
    if (t == null) {
        resp.statusMessage = '"t" field is invalid! (Null field)';
        return resp.sendStatus(400);
    } else if (isNaN(t)) {
        resp.statusMessage = '"t" field is invalid! (Not a number)';
        return resp.sendStatus(400);
    } else if (t != 0 && t != 1) {
        resp.statusMessage = '"t" field is invalid! (Invalid Type)';
        return resp.sendStatus(400);
    }

    // Return url built from submitted parameters
    resp.send({map_url: get_map({
        'lat' : req.query.lat,
        'lon' : req.query.lon,
        'zoom' : req.query.z,
        'image_width' : req.query.x,
        'image_height' : req.query.y,
        'image_type' : req.query.t
    })});
});

module.exports = app;