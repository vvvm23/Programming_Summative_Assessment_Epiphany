// Example test
const sum = function(x, y) {return x + y;};

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
//

const express = require('express');
const request = require('supertest');
const app = require('./server');

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
