const request = require('supertest');
const app = require('./app');
const mock = require('./app_mock')

function test_country_china(res) {
    const json = res.body;
    if (typeof json !== 'object') {
        throw new Error('Not an object!');
    }

    if (json['name']['common'] !== 'China') {
        throw new Error('Incorrect common name');
    }

    if (json['name']['official'] !== 'People\'s Republic of China') {
        throw new Error('Incorrect official name');
    }

    if (json['native_name']['common'] !== '中国') {
        throw new Error('Incorrect native common');
    }

    if (json['native_name']['official'] !== '中华人民共和国') {
        throw new Error('Incorrect native official');
    }

    if (json['region'] !== 'Asia') {
        throw new Error('Incorrect region');
    }

    if (json['subregion'] !== 'Eastern Asia') {
        throw new Error('Incorrect subregion');
    }

    if (json['capital'] != 'Beijing') {
        throw new Error('Incorrect capital');
    }

    if (json['currency'] != 'CNY') {
        throw new Error('Incorrect currency');
    }

    if (json['languages']['zho'] !== 'Chinese') {
        throw new Error('Incorrect languages');
    }

    if (json['demonym'] !== 'Chinese') {
        throw new Error('Incorrect demonym');
    }

    if (json['independent'] !== true) {
        throw new Error('Incorrect independent');
    }

    if (json['translations']['fra']['official'] !== 'R\u00e9publique populaire de Chine') {
        throw new Error('Incorrect translations official');
    }

    if (json['translations']['fra']['common'] !== 'Chine') {
        throw new Error('Incorrect translations common');
    }

    if (json['flag'] !== '\ud83c\udde8\ud83c\uddf3') {
        throw new Error('Incorrect flag');
    }

    if (json['latlng'][0] !== 35 || json['latlng'][1] !== 105) {
        throw new Error('Incorrect latlng');
    }

    if (JSON.stringify(json['borders']) !== JSON.stringify([
        'AFG',
        'BTN',
        'MMR',
        'HKG',
        'IND',
        'KAZ',
        'NPL',
        'PRK',
        'KGZ',
        'LAO',
        'MAC',
        'MNG',
        'PAK',
        'RUS',
        'TJK',
        'VNM'
    ])) {
        throw new Error('Incorrect borders');
    }

    if (json['landlocked'] !== false) {
        throw new Error('Incorrect landlocked');
    }

    if (json['area'] !== 9706961) {
        throw new Error('Incorrect area');
    }

    if (json['callingCode'][0] !== '86') {
        throw new Error('Incorrect callingCode');
    }

    if (json['tld'][0] !== '.cn') {
        throw new Error('Incorrect tld');
    }
}

function test_country_uk(res) {
    const json = res.body;
    if (typeof json !== 'object') {
        throw new Error('Not an object!');
    }

    if (json['name']['common'] !== 'United Kingdom') {
        throw new Error('Incorrect common name');
    }

    if (json['name']['official'] !== 'United Kingdom of Great Britain and Northern Ireland') {
        throw new Error('Incorrect official name');
    }

    if (json['native_name']['common'] !== 'United Kingdom') {
        throw new Error('Incorrect native common');
    }

    if (json['native_name']['official'] !== 'United Kingdom of Great Britain and Northern Ireland') {
        throw new Error('Incorrect native official');
    }

    if (json['region'] !== 'Europe') {
        throw new Error('Incorrect region');
    }

    if (json['subregion'] !== 'Northern Europe') {
        throw new Error('Incorrect subregion');
    }

    if (json['capital'] != 'London') {
        throw new Error('Incorrect capital');
    }

    if (json['currency'] != 'GBP') {
        throw new Error('Incorrect currency');
    }

    if (json['languages']['eng'] !== 'English') {
        throw new Error('Incorrect languages');
    }

    if (json['demonym'] !== 'British') {
        throw new Error('Incorrect demonym');
    }

    if (json['independent'] !== true) {
        throw new Error('Incorrect independent');
    }

    if (json['translations']['fra']['official'] !== 'Royaume-Uni de Grande-Bretagne et d\'Irlande du Nord') {
        throw new Error('Incorrect translations official');
    }

    if (json['translations']['fra']['common'] !== 'Royaume-Uni') {
        throw new Error('Incorrect translations common');
    }

    if (json['flag'] !== '\ud83c\uddec\ud83c\udde7') {
        throw new Error('Incorrect flag');
    }

    if (json['latlng'][0] !== 54 || json['latlng'][1] !== -2) {
        throw new Error('Incorrect latlng');
    }

    if (JSON.stringify(json['borders']) !== JSON.stringify([
        'IRL'
    ])) {
        throw new Error('Incorrect borders');
    }

    if (json['landlocked'] !== false) {
        throw new Error('Incorrect landlocked');
    }

    if (json['area'] !== 242900) {
        throw new Error('Incorrect area');
    }

    if (json['callingCode'][0] !== '44') {
        throw new Error('Incorrect callingCode');
    }

    if (json['tld'][0] !== '.uk') {
        throw new Error('Incorrect tld');
    }
}

function test_country_us(res) {
    const json = res.body;
    if (typeof json !== 'object') {
        throw new Error('Not an object!');
    }

    if (json['name']['common'] !== 'United States') {
        throw new Error('Incorrect common name');
    }

    if (json['name']['official'] !== 'United States of America') {
        throw new Error('Incorrect official name');
    }

    if (json['native_name']['common'] !== 'United States') {
        throw new Error('Incorrect native common');
    }

    if (json['native_name']['official'] !== 'United States of America') {
        throw new Error('Incorrect native official');
    }

    if (json['region'] !== 'Americas') {
        throw new Error('Incorrect region');
    }

    if (json['subregion'] !== 'North America') {
        throw new Error('Incorrect subregion');
    }

    if (json['capital'] != 'Washington D.C.') {
        throw new Error('Incorrect capital');
    }

    if (json['currency'] != 'USD') {
        throw new Error('Incorrect currency');
    }

    if (json['languages']['eng'] !== 'English') {
        throw new Error('Incorrect languages');
    }

    if (json['demonym'] !== 'American') {
        throw new Error('Incorrect demonym');
    }

    if (json['independent'] !== true) {
        throw new Error('Incorrect independent');
    }

    if (json['translations']['jpn']['official'] !== '\u30a2\u30e1\u30ea\u30ab\u5408\u8846\u56fd') {
        throw new Error('Incorrect translations official');
    }

    if (json['translations']['jpn']['common'] !== '\u30a2\u30e1\u30ea\u30ab\u5408\u8846\u56fd') {
        throw new Error('Incorrect translations common');
    }

    if (json['flag'] !== '\ud83c\uddfa\ud83c\uddf8') {
        throw new Error('Incorrect flag');
    }

    if (json['latlng'][0] !== 38 || json['latlng'][1] !== -97) {
        throw new Error('Incorrect latlng');
    }

    if (JSON.stringify(json['borders']) !== JSON.stringify([
        'CAN',
        'MEX'
    ])) {
        throw new Error('Incorrect borders');
    }

    if (json['landlocked'] !== false) {
        throw new Error('Incorrect landlocked');
    }

    if (json['area'] !== 9372610) {
        throw new Error('Incorrect area');
    }

    if (json['callingCode'][0] !== '1') {
        throw new Error('Incorrect callingCode');
    }

    if (json['tld'][0] !== '.us') {
        throw new Error('Incorrect tld');
    }
}

function test_search_delete_france(res) {
    const json = res.body;

    if (typeof json !== 'object') {
        throw new Error('Not an object!');
    }

    if (!(json['index'] === 76 && json['name'] === 'France')) {
        throw new Error('Response incorrect!')
    }
}

describe('Testing GET services success', () => {
    test('GET / succeeds', () => {
        return request(app)
            .get('/')
            .expect(200);
    });

    test('GET /query succeeds (Common Name)', () => {
        return request(app)
            .get('/query?name=China&check=111111111111111')
            .expect(200);
    });

    test('GET /query succeeds (Official Name)', () => {
        return request(app)
            .get('/query?name=People%27s%20Republic%20of%20China&check=111111111111111')
            .expect(200);
    });

    test('GET /query succeeds (Native Name)', () => {
        return request(app)
            .get('/query?name=%E4%B8%AD%E5%9B%BD&check=111111111111111')
            .expect(200);
    });

    test('GET /query succeeds (Check contents CHINA)', () => {
        return request(app)
            .get('/query?name=China&check=111111111111111')
            .expect(test_country_china);
    });

    test('GET /query succeeds (Check contents UK)', () => {
        return request(app)
            .get('/query?name=United%20Kingdom&check=111111111111111')
            .expect(test_country_uk);
    });

    test('GET /query succeeds (Check contents US)', () => {
        return request(app)
            .get('/query?name=United%20States&check=111111111111111')
            .expect(test_country_us);
    });

    test('GET /map succeeds', () => {
        return request(app)
            .get('/map?lat=0&t=0&lon=0&z=1&x=100&y=100')
            .expect(200);
    });

    test('GET /wiki succeeds', () => {
        return request(app)
            .get('/wiki?name=China')
            .expect(200);
    });

    test('GET /query Content-type', () => {
        return request(app)
            .get('/query?name=China&check=111111111111111')
            .expect('Content-type', /json/);
    });

    test('GET /map Content-type', () => {
        return request(app)
            .get('/map?lat=0&t=0&lon=0&z=1&x=100&y=100')
            .expect('Content-type', /json/);
    });

    test('GET /wiki Content-type', () => {
        return request(app)
            .get('/wiki?name=China')
            .expect('Content-type', /json/);
    });
});

describe('Testing GET malformed requests', () => {
    describe('For /query', () => {
        test('GET /query malformed (No parameters)', () => {
            return request(app)
                .get('/query')
                .expect(400);
        });

        test('GET /query malformed (Missing Name)', () => {
            return request(app)
                .get('/query?check=111111111111111')
                .expect(400);
        });

        test('GET /query malformed (Missing Check string)', () => {
            return request(app)
                .get('/query?name=China')
                .expect(400);
        });

        test('GET /query malformed (Check string too short)', () => {
            return request(app)
                .get('/query?name=China&check=111')
                .expect(400);
        });

        test('GET /query malformed (Check string too long)', () => {
            return request(app)
                .get('/query?name=China&check=1111111111111111111111111111111111111')
                .expect(400);
        });

        test('GET /query malformed (Country does not exist)', () => {
            return request(app)
                .get('/query?name=ABCDEFGHIJKLMNOPQRSTUVWXYZ&check=111111111111111')
                .expect(400);
        });
    });

    describe('For /wiki', () => {
        test('GET /wiki malformed (No parameters)', () => {
            return request(app)
                .get('/wiki')
                .expect(400);
        });
    });

    describe('For /map', () => {
        test('GET /map malformed (No parameters)', () => {
            return request(app)
                .get('/map')
                .expect(400);
        });
        ///map?lat=0&t=0&lon=0&z=1&x=100&y=100
        test('GET /map malformed (No parameters)', () => {
            return request(app)
                .get('/map')
                .expect(400);
        });

        test('GET /map malformed (Missing lat)', () => {
            return request(app)
                .get('/map?t=0&lon=0&z=1&x=100&y=100')
                .expect(400);
        });

        test('GET /map malformed (Missing lon)', () => {
            return request(app)
                .get('/map?lat=0&t=0&z=1&x=100&y=100')
                .expect(400);
        });

        test('GET /map malformed (Missing t)', () => {
            return request(app)
                .get('/map?lat=0&lon=0&z=1&x=100&y=100')
                .expect(400);
        });

        test('GET /map malformed (Missing z)', () => {
            return request(app)
                .get('/map?lat=0&t=0&lon=0&x=100&y=100')
                .expect(400);
        });

        test('GET /map malformed (Missing dim_x)', () => {
            return request(app)
                .get('/map?lat=0&t=0&lon=0&z=1&y=100')
                .expect(400);
        });

        test('GET /map malformed (Missing dim_y)', () => {
            return request(app)
                .get('/map?lat=0&t=0&lon=0&z=1&x=100')
                .expect(400);
        });

        test('GET /map malformed (Negative t)', () => {
            return request(app)
                .get('/map?lat=0&t=-1&lon=0&z=1&x=100&y=100')
                .expect(400);
        });

        test('GET /map malformed (Negative z)', () => {
            return request(app)
                .get('/map?lat=0&t=0&lon=0&z=-1&x=100&y=100')
                .expect(400);
        });

        test('GET /map malformed (Negative dim_x)', () => {
            return request(app)
                .get('/map?lat=0&t=0&lon=0&z=1&x=-100&y=100')
                .expect(400);
        });

        test('GET /map malformed (Negative dim_y)', () => {
            return request(app)
                .get('/map?lat=0&t=0&lon=0&z=1&x=100&y=-100')
                .expect(400);
        });

        test('GET /map malformed (NaN lat)', () => {
            return request(app)
                .get('/map?lat=XYZ&t=0&lon=0&z=1&x=100&y=100')
                .expect(400);
        });
        
        test('GET /map malformed (NaN lon)', () => {
            return request(app)
                .get('/map?lat=0&t=0&lon=XYZ&z=1&x=100&y=100')
                .expect(400);
        });

        test('GET /map malformed (NaN t)', () => {
            return request(app)
                .get('/map?lat=0&t=XYZ&lon=0&z=1&x=100&y=100')
                .expect(400);
        });

        test('GET /map malformed (NaN z)', () => {
            return request(app)
                .get('/map?lat=0&t=0&lon=0&z=XYZ&x=100&y=100')
                .expect(400);
        });

        test('GET /map malformed (NaN dim_x)', () => {
            return request(app)
                .get('/map?lat=0&t=0&lon=0&z=1&x=XYZ&y=100')
                .expect(400);
        });

        test('GET /map malformed (NaN dim_y)', () => {
            return request(app)
                .get('/map?lat=0&t=0&lon=0&z=1&x=100&y=XYZ')
                .expect(400);
        });
    });
});

describe('Test POST services success', () => {
    
});

describe('Test secure GET services success', () => {
    test('GET /search/edit succeeds', () => {
        return request(mock)
            .get('/search/edit?name=France')
            .expect(200);
    });

    test('GET /search/delete succeeds', () => {
        return request(mock)
            .get('/search/delete?name=France')
            .expect(200);
    });

    test('GET /search/edit Content-type', () => {
        return request(mock)
            .get('/search/edit?name=France')
            .expect('Content-type', /json/);
    });

    test('GET /search/delete Content-type', () => {
        return request(mock)
            .get('/search/delete?name=France')
            .expect('Content-type', /json/);
    });

    test('GET /search/edit (Check contents CHINA)', () => {
        return request(mock)
            .get('/search/edit?name=China')
            .expect(test_country_china);
    });

    test('GET /search/delete (Check contents FRANCE)', () => {
        return request(mock)
            .get('/search/delete?name=France')
            .expect(test_search_delete_france);
    });
});

describe('Test secure GET services malformed', () => {
    describe('For /search/edit', () => {
        test('GET /search/edit malformed (Missing name)', () => {
            return request(mock)
                .get('/search/edit')
                .expect(400);
        });

        test('GET /search/edit malformed (Country does not exist)', () => {
            return request(mock)
                .get('/search/edit?name=ABCDEFGHIJKLMNOPQRSTUVWXYZ')
                .expect(400);
        });
    });

    describe('For /search/delete', () => {
        test('GET /search/delete malformed (Missing Name)', () => {
            return request(mock)
                .get('/search/delete')
                .expect(400);
        });

        test('GET /search/delete malformed (Country does not exist)', () => {
            return request(mock)
                .get('/search/delete?name=ABCDEFGHIJKLMNOPQRSTUVWXYZ')
                .expect(400);
        });
    });
});