import { server } from '../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
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
                console.log(res.body.user);
              done();
            });
    });
  });
});