const request = require('supertest')
const app = require('../app');
const mongoose = require('mongoose');
const connectDB = require('../config/database');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
}); 

describe('Auth Api', () =>{
    it('Should login user and return token', async () => {
        const res  = await request(app)
        .post('/login')
        .send({
            emailId:"test@gmail.com",
            password:"Test@123"
        })
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    })
})