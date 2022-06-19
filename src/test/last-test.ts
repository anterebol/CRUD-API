import { server, createId } from '../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
const dataBase = require('../data.json')
let should = chai.should();

let userId: string;
let name = 'name'
let countUsers = 0;

const hobbies = ['builder', 'flower', 'gamer', 'IT', 'listen music', 'football']
function createUser() {
  let years = Math.floor(Math.random() * 47);
  return {
    username: name + years,
    age: years,
    hobbies: hobbies[Math.floor(Math.random() * 6)]
  }
}

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
  for (let i = 0; i < 3; i++) {
    describe('/POST api/users', () => {
      it('it should POST new users', (done) => {
        let user = createUser()
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
                done();
              });
      });
    });
  }
  describe(`/GET api/users`, () => {
    it(`it should Get all users`, (done) => {
      countUsers = Object.keys(dataBase).length
        chai.request(server)
            .get(`/api/users`)
            .end((err, res) => {
                res.should.have.status(200);
                console.log(res.body);
              done();
            });
    });
  });
  for (let key in dataBase) {
    if (Math.floor(Math.random() * 1000) % 2 === 0) {
      describe('/DELETE api/users/:userId', () => {
        it(`it should DELETE random users`, (done) => {
          chai.request(server)
                .delete(`/api/users/${key}`)
                .end((err, res) => {
                  countUsers--
                  res.should.have.status(204);
                  res.body.message === 'User Deleted';
                  done();
                });
        });
      });
    }
  }
  describe(`/GET api/users`, () => {
    it(`it should Get all users`, (done) => {
        chai.request(server)
            .get(`/api/users`)
            .end((err, res) => {
              const countRes = Object.keys(res.body).length
              if (countRes === countUsers) {
                console.log('Work correct')
              }
              done();
            });
    });
  });
});