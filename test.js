const request = require('supertest');
const app = require('./app');

describe('Testing GET services success', () => {
    test('GET / succeeds', () => {
        return request(app)
            .get('/')
            .expect(200);
    });

    test('GET /query succeeds', () => {
        return request(app)
            .get('/query?name=China&check=111111111111111')
            .expect(200);
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
    
})