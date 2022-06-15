import { server, createId } from '../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
const dataBase = require('../data.json')
let should = chai.should();

function randomId() {
  if (Math.floor(Math.random() * 10) > 5) {
    const arrId = Object.keys(dataBase)
    const number = Math.floor(Math.random() * Object.keys(arrId).length);
    return arrId[number]
  } return createId()
}

const userId = randomId()
chai.use(chaiHttp);

describe('Users', () => {
  describe(`/GET api/users/:${userId}`, () => {
    it(`it should Get user with ${userId}`, (done) => {
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
});