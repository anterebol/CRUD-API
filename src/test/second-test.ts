import { server, createId } from '../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
let should = chai.should();

let userId = createId();
let incorrectID = 11111111111111;
chai.use(chaiHttp);

describe('Users', async () => {
  describe('/POST api/users', () => {
    it('it should return 400 code cause we use bad reqest', (done) => {
      let user = {
            username: "name",
        }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
              done();
            });
    });
  });
  describe('/GET api/users/:userId', () => {
    it('it should return 404 code cause data base havent user with current id', (done) => {
        chai.request(server)
            .get(`/api/users/${userId}`)
            .end((err, res) => {
                res.should.have.status(404);
              done();
            });
    });
  });
  describe(`/PUT api/users/:userId`, () => {
    it(`it should return 404 code cause data base havent user with current id`, (done) => {
      let user = {
        username: "new name",
        age: 20,
        hobbies: 'builder'
    }
        chai.request(server)
            .put(`/api/users/${userId}`)
            .send(user)
            .end((err, res) => {
                res.should.have.status(404);
              done();
            });
    });
  });
  describe('/DELETE api/users/:userId', () => {
    it(`it should return 404 code cause data base havent user with current id`, (done) => {
        chai.request(server)
            .delete(`/api/users/${userId}`)
            .end((err, res) => {
                res.should.have.status(404);
              done();
            });
    });
  });
  describe('/GET api/users/:userId', () => {
    it('it should return 400 code cause we use incorrect ID', (done) => {
        chai.request(server)
            .get(`/api/users/${incorrectID}`)
            .end((err, res) => {
                res.should.have.status(400);
              done();
            });
    });
  });
  describe(`/PUT api/users/:userId`, () => {
    it(`it should return 400 code cause we use incorrect ID`, (done) => {
      let user = {
        username: "new name",
        age: 20,
        hobbies: 'builder'
    }
        chai.request(server)
            .put(`/api/users/${incorrectID}`)
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
              done();
            });
    });
  });
  describe('/DELETE api/users/:userId', () => {
    it(`it should return 400 code cause we use incorrect ID`, (done) => {
        chai.request(server)
            .delete(`/api/users/${incorrectID}`)
            .end((err, res) => {
                res.should.have.status(400);
              done();
            });
    });
  });
});