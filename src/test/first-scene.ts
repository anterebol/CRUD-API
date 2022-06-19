import { server, createId } from '../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
const dataBase = require('../data.json')
let should = chai.should();

let userId;

chai.use(chaiHttp);

describe('Users', async () => {
  describe(`/GET api/users`, () => {
    it(`it should Get all users`, (done) => {
        chai.request(server)
            .get(`/api/users`)
            .end((err, res) => {
                res.should.have.status(200);
                console.log(res.body);
              done();
            });
    });
  });
  describe('/POST api/users', () => {
    it('it should POST new users', (done) => {
      let user = {
            username: "name",
            age: 111,
            hobbies: 'IT'
        }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.user.should.have.property('id');
                res.body.user.should.have.property('username');
                res.body.user.should.have.property('age');
                res.body.user.should.have.property('hobbies');
                userId = res.body.user.id;
                console.log(res.body.user);
              done();
            });
    });
  });
  describe('/GET api/users/:userId', () => {
    it('it should Get user with userId', (done) => {
        chai.request(server)
            .get(`/api/users/${userId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('id');
                res.body.should.have.property('username');
                res.body.should.have.property('age');
                res.body.should.have.property('hobbies');
                console.log(res.body);
              done();
            });
    });
  });
  describe(`/PUT api/users/:userId`, () => {
    it(`it should update user with userId`, (done) => {
      let user = {
        username: "new name",
        age: 20,
        hobbies: 'builder'
    }
        chai.request(server)
            .put(`/api/users/${userId}`)
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.user.should.have.property('id');
                res.body.user.should.have.property('username');
                res.body.user.should.have.property('age');
                res.body.user.should.have.property('hobbies');
                console.log(res.body);
              done();
            });
    });
  });
  describe('/DELETE api/users/:userId', () => {
    it(`it should DELETE user with userId`, (done) => {
        chai.request(server)
            .delete(`/api/users/${userId}`)
            .end((err, res) => {
                res.should.have.status(204);
                res.body.message === 'User Deleted';
              done();
            });
    });
  });
  describe('/GET api/users/:userId', () => {
    it('it should return ', (done) => {
        chai.request(server)
            .get(`/api/users/${userId}`)
            .end((err, res) => {
                res.should.have.status(404);
              done();
            });
    });
  });
});