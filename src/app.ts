import fsPromise from 'fs/promises';
import path from 'path';
import http from 'http';
import url from 'url';
import Emmit from 'events';
import { idText } from 'typescript';
let dataBase = require('./data.json');

const createId = (count: number) => {
  const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let id = 'id_';

  for (let i = 0; i < count; i++) {
    const item = Math.floor(Math.random() * 36);
    id += arr[item];
  }
  return id;
}
function updateDB(data, code, res, user) {
  fsPromise.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 2)).then(() => {
    res.writeHead(code, 'ok', {'content-type': 'application/json'});
    res.write(JSON.stringify(user));
    res.end();
  }).catch((err) => {
    res.writeHead(500, 'Server error', {'content-type': 'application/json'});
    res.end();
  })
}
const server = http.createServer(async (req, res) => {
  let urlReq = url.parse(req.url, true);
  let answer: string;
  const urlParse = req.url.split(/\//g).filter(item => item !== '')
  const userId = urlParse.length === 3 ? urlParse[2] : '';
  let userInfo = Object.create({});
  switch (true) {
    case req.url === '/api/users' && req.method === 'GET':
      res.writeHead( 200, 'Ok', {'content-type' : 'JSON'});
      res.write(JSON.stringify(dataBase));
      res.end()
      break;
    case req.url === `/api/users/${userId}` &&  req.method === 'GET':
      if (/id_[0-9a-z]{4}/.exec(userId)) {
        for (let id in dataBase) {
          if (id === userId) {
            answer = JSON.stringify(dataBase[id]);
            res.writeHead( 201, 'Ok', {'content-type' : 'JSON'});
            res.write('User info: ' + answer);
            res.end();
          }
        }
        if (!answer) {
          res.writeHead( 404, 'User not found', {'content-type' : 'text/plain'});
          res.end();
        }
      } else {
        res.writeHead( 400, 'Wrong Id', {'content-type' : 'text/plain'});
        res.end();
      }
      break;
    case req.url === `/api/users` &&  req.method === 'POST':
      const postEmmiter = new Emmit();
      postEmmiter.on('post_emmit', () => {
        const { username, age, hobbies } = userInfo;
        if (username && age && hobbies) {
          let id = createId(4);
          while (dataBase[id]) {
            id = createId(4);
          }
          const user = { id, username, age, hobbies }
          dataBase[id] = { ...user };
          updateDB(dataBase, 201, res, user)
        } else {
          res.writeHead(404, 'Bad Request, body is invalid', {'content-type': 'application/json'});
          res.end();
        }
      });
      req.on('data', async (data) => {
        const objData = await JSON.parse(data);
        for (let key in objData) {
          userInfo[key] = objData[key];
        }
      });
      req.on('end', () => {
        postEmmiter.emit('post_emmit');
      })
      break;
    case req.url === `/api/users/${userId}` &&  req.method === 'PUT':
        if (/id_[0-9a-z]{4}/.exec(userId)) {
          for (let id in dataBase) {
            if (id === userId) {
              const putEmmiter = new Emmit();
              putEmmiter.on('put_emmit', () => {
                const username = userInfo.username || dataBase[userId].username;
                const age = userInfo.age || dataBase[userId].age
                const hobbies = userInfo.hobbies || dataBase[userId].hobbies;
                const user = { userId, username, age, hobbies }
                dataBase[userId] = { ...user };
                updateDB(dataBase, 200, res, user);
              });
              req.on('data', (data) => {
                const objData = JSON.parse(data);
                for (let key in objData) {
                  userInfo[key] = objData[key];
                }
              });
              req.on('end', () => {
                putEmmiter.emit('put_emmit');
              })
            }
          }
        } else {
            res.writeHead( 400, 'Wrong Id', {'content-type' : 'text/plain'});
            res.end();
        }
        break;
    default:
      res.writeHead( 404, 'This page not found', {'content-type' : 'text/plain'});
      res.end();
      break;
  }

})
server.listen(4000);