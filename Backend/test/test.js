/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
const chai = require('chai');

const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const apiHost = 'http://3.129.9.238';
const apiPort = '3004';
const apiUrl = `${apiHost}:${apiPort}`;
const { expect } = chai;

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjhmM2Y5ODMzOTI4ZDQ5M2M3ZGVlY2UiLCJ1c2VybmFtZSI6ImJ1c2luZXNzQGdtYWlsLmNvbSIsInJvbGUiOiJSZXN0YXVyYW50IiwiaWF0IjoxNjA0NjI2OTI5LCJleHAiOjE2MDU2MzQ5Mjl9.gOD5qsFMQeXN-VrDwMhCI3jYYO3-xjxpYaIbeWPNEsk';

// Fetching states and country
it('Test Fetching Of States and Country', function (done) {
  chai
    .request(apiUrl)
    .get('/staticData/fetchStaticData')
    .send()
    .end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
});

// InValid login
it('Testing of invalid customer Login', function (done) {
  chai
    .request(apiUrl)
    .post('/customer/loginCustomer')
    .send({
      emailID: 'Customer@gmail.com',
      password: 'login',
    })
    .end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res.text).to.equal('Invalid Credentials');
      done();
    });
});

// Valid login
it('Testing of Valid Restaurant Login', function (done) {
  chai
    .request(apiUrl)
    .post('/restaurant/loginRestaurant')
    .send({
      emailID: 'business@gmail.com',
      password: 'business',
    })
    .end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
});

// Fetching customer profile
it('Test Fetching Customer Profile', function (done) {
  chai
    .request(apiUrl)
    .get('/customer/getCustomerCompleteProfile')
    .set({ Authorization: `JWT ${token}` })
    .query({ CustomerID: '5f8f3f9833928d493c7deece' })
    .send()
    .end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
});

// Fetching restaurant search strings
it('Test Fetching Restaurant all possibe search strings', function (done) {
  chai
    .request(apiUrl)
    .get('/customer/fetchSearchStrings')
    .set({ Authorization: `JWT ${token}` })
    .send()
    .end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
});

// Customer Signup
it('Testing of Customer Signup', function (done) {
  chai
    .request(apiUrl)
    .post('/customer/signupCustomer')
    .send({
      emailID: 'karan15@gmail.com',
      password: 'karan',
      role: 'Customer',
      firstName: 'Karan',
      lastName: 'Khanna',
      gender: 'male',
      contact: 6692045124,
      streetAddress: '765, The Alameda',
      city: 'San Jose',
      stateName: 'California',
      country: 'United States',
      zip: 95126,
    })
    .end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res.text).to.equal('Successfully saved');
      done();
    });
});
