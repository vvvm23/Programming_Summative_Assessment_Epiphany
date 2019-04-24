const express = require('express');
const app_mock = express();
const cookieParser = require('cookie-parser');

const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const FuzzySet = require('fuzzyset.js');
app_mock.use(bodyParser.urlencoded({extended: false}));
app_mock.use(bodyParser.json());
app_mock.use(cookieParser());
// Load json dataset into memory //
let json_countries = require('./json/countries.json');

const type = function(obj) {
    return Object.prototype.toString.app_mockly(obj).replace(/\[object (.+)\]/i, '$1').toLowerCase();
};

const stripHTML = function(untrusted) { return sanitizeHtml(untrusted); };

// -----------------------------AUTH 0----------------------------- //

app_mock.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app_mock.post('/add', (req, res) => {
    // Add Country secure endpoint
    try {    
        let json_body = req.body;
        let id_list = ['name', 'region', 'subregion', 'capital', 'currency', 'languages', 'demonym', 'independent',
            'translations', 'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];


        let index = json_countries.length;
        json_countries.push({});

        const restore = function() {json_countries.splice(index, 1);};
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
        country_names = generate_country_list();
        country_index = generate_country_index();
        fuzz = generate_country_fuzzy(country_names);
        res.send({'name': json_body['name_common']});
    } catch (err) {
        res.statusMessage = 'Failed to add entry! (Unknown)';
        return res.sendStatus(400);
    }
});

app_mock.post('/edit', (req, res) => {
    // Edit Country secure endpoint
    try {    
        let json_body = req.body;
        let index = json_body['index'];

        let restore_state = JSON.parse(JSON.stringify(json_countries[index]));
        const restore = function() {json_countries[index] = restore_state;};

        let original_name = json_countries[index]['name']['common'];

        let id_list = ['name', 'region', 'subregion', 'capital', 'currency', 'languages', 'demonym', 'independent',
            'translations', 'flag', 'latlng', 'borders', 'landlocked', 'area', 'callingcode', 'domain'];

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

        country_names = generate_country_list();
        country_index = generate_country_index();
        fuzz = generate_country_fuzzy(country_names);

        res.send({'name': original_name});
    } catch(err) {
        res.statusMessage = 'Failed to edit entry! (Unknown)';
        return res.sendStatus(400);
    }
});

app_mock.get('/search/delete', (req, res) => {
    // Search Country for delete secure endpoint
    // Returns Common name (maybe index too?)
    let query_name = req.query.name;
    let i = find_country(query_name);

    if (i instanceof Error) {
        res.statusMessage = 'Country not found';
        return res.sendStatus(400);
    }
    let actual_name = json_countries[i]['name']['common'];
    res.send({index: i, name: actual_name});
});

app_mock.get('/search/edit', (req, res) => {
    // Search Country for edit secure endpoint
    // Returns all current data about a country
    
    let query_name = req.query.name;

    if (!query_name) {
        res.statusMessage = 'No name specified';
        return res.sendStatus(400);
    }

    let index = find_country(query_name);

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

    let statistics = get_country_statistics(index, all);
    statistics['index'] = index;
    res.send(statistics);

});

app_mock.post('/delete', (req, res) => {
    // Delete country secure endpoint
    // receives json in form, {index: x}
    // delete at index
    try {
        let index = req.body.index;
        if (index < 0 || index > json_countries.length - 1) {
            res.statusMessage = 'Failed to delete entry! (Index out of range)';
            return res.sendStatus(400);
        }
        json_countries.splice(index, 1);
        country_names = generate_country_list();
        country_index = generate_country_index();
        fuzz = generate_country_fuzzy(country_names);
        res.sendStatus(200);
    } catch (error) {
        res.statusMessage = 'Failed to delete entry! (Unknown)';
        res.sendStatus(400);
    }

});

// ----------------------------- COUNTRY ----------------------------- //

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
    
    let fuzz_result = fuzz.get(name);
    try {
        return country_index[country_names[fuzz_result[0][1]]];
    } catch (error) {
        return error;
    }
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
    let native = full_country_data['name']['native'];
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
    const app_mock_ID = 'RUw2eiQLvRoOmpWww3e7';
    const app_mock_CODE = 'Jd2W3CtG6MJl0OL-LBoLAg';
    let url = 'https://image.maps.api.here.com/mia/1.6/mapview?';
    url = url + 'app_mock_id=' + app_mock_ID + '&app_mock_code=' + app_mock_CODE;
    url = url + '&lat=' + settings['lat'];
    url = url + '&lon=' + settings['lon'];
    url = url + '&z=' + settings['zoom'];
    url = url + '&w=' + settings['image_width'];
    url = url + '&h=' + settings['image_height'];
    url = url + '&t=' + settings['image_type'];
    return url;
}

/*app_mock.use(express.static('client'));

app_mock.get('/query', function (req, resp) {     
    let check_string = req.query.check;
    if (check_string == null) {
        resp.statusMessage = 'Check string was empty!';
        return resp.sendStatus(400);
    }

    if (check_string.length != 15) {
        resp.statusMessage = 'Check String of incorrect length!';
        return resp.sendStatus(400);
    }

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
    if (query_name == null) {
        resp.statusMessage = 'Query name was empty!';
        return resp.sendStatus(400);
    }
    let index = find_country(query_name);

    if (index instanceof Error) {
        resp.statusMessage = 'Country does not exist!';
        resp.sendStatus(400);
    } else {
        let statistics = get_country_statistics(index, check);
        resp.send(statistics);
    }
});

app_mock.get('/wiki', function (req, resp) {
    // Query wikipedia API
    // Take Official Name of country as input
    let name = req.query.name;
    if (name == null) {
        resp.statusMessage = 'Name was missing!';
        return resp.sendStatus(400);
    }
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

            resp.send({'wiki': output});
        })
        .catch(() => {
            resp.statusMessage = 'Failed to fetch from wikipedia';
            return resp.sendStatus(400);
        });
});

app_mock.get('/map', function (req, resp) {
    // Query here maps API
    // maybe simply send selected country index rather than lat lon
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

    resp.send({map_url: get_map({
        'lat' : req.query.lat,
        'lon' : req.query.lon,
        'zoom' : req.query.z,
        'image_width' : req.query.x,
        'image_height' : req.query.y,
        'image_type' : req.query.t
    })});
});

/*app_mock.use(function (req, resp, next) {
	resp.sendStatus(404);
});*/

module.exports = app_mock;