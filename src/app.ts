import fsPromise from 'fs/promises';
const uuid = require('uuid');
import path from 'path';
import http from 'http';
import Emmit from 'events';
import dotenv from 'dotenv';

let dataBase = require('./data.json');

dotenv.config();
const PORT = process.env.PORT

function checkUuid(id: string) {
  return /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.exec(id);
}

export function createId() {
  return uuid.v4();
}

function updateDB(data: JSON, code: number, res: any, user: {}, status: string) {
  fsPromise.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 2)).then(() => {
    const data = {
      message: 'User ' + status,
      user: {
        ...user
      }
    }
    console.log(data);
    res.writeHead(code, 'ok', {'content-type': 'application/json'});
    res.write(JSON.stringify(data));
    res.end();
  }).catch((err) => {
    res.writeHead(500, 'Server error', {'content-type': 'application/json'});
    res.end();
  })
}

export const server = http.createServer(async (req, res) => {
  let answer: string;
  const urlParse = req.url.split(/\//g).filter(item => item !== '')
  const userId = urlParse.length === 3 ? urlParse[2] : '';
  let userInfo = Object.create({});
  switch (true) {
    case req.url === '/api/users' && req.method === 'GET':
      try {
        res.writeHead( 200, 'Ok', {'content-type' : 'aplication/json'});
        res.write(JSON.stringify(dataBase));
        res.end();
      } catch {
        res.writeHead( 500, 'Server error', {'content-type' : 'text/plain'});
        res.end();
      }
      break;
    case req.url === `/api/users/${userId}` &&  req.method === 'GET':
      try {
        if (checkUuid(userId) && userId.length === 36) {
          if (dataBase[userId]) {
            answer = JSON.stringify(dataBase[userId]);
            res.writeHead( 200, 'Ok', {'content-type' : 'aplication/json'});
            res.write(answer);
            res.end();
          }
          if (!answer) {
            res.writeHead( 404, 'User not found', {'content-type' : 'text/plain'});
            res.end();
          }
        } else {
          res.writeHead( 400, 'Wrong Id', {'content-type' : 'text/plain'});
          res.end();
        }
      } catch {
        res.writeHead( 500, 'Server error', {'content-type' : 'text/plain'});
        res.end();
      }
      break;
    case req.url === `/api/users` &&  req.method === 'POST':
      try {
        const postEmmiter = new Emmit();
        postEmmiter.on('post_emmit', () => {
          const { username, age, hobbies } = userInfo;
          if (username && age && hobbies) {
            let id = createId();
            while (dataBase[id]) {
              id = createId();
            }
            const user = { id, username, age, hobbies }
            dataBase[id] = { ...user };
            updateDB(dataBase, 201, res, user, 'added')
          } else {
            res.writeHead(400, 'Bad Request, body is invalid', {'content-type': 'application/json'});
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
      } catch {
        res.writeHead( 500, 'Server error', {'content-type' : 'text/plain'});
        res.end();
      }
      break;
    case req.url === `/api/users/${userId}` &&  req.method === 'PUT':
        try {
          if (checkUuid(userId) && userId.length === 36) {
            if (dataBase[userId]) {
              const putEmmiter = new Emmit();
              putEmmiter.on('put_emmit', () => {
                const username = userInfo.username || dataBase[userId].username;
                const age = userInfo.age || dataBase[userId].age
                const hobbies = userInfo.hobbies || dataBase[userId].hobbies;
                const user = { id: userId, username, age, hobbies }
                dataBase[userId] = { ...user };
                updateDB(dataBase, 200, res, user, 'Update');
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
            } else {
              res.writeHead( 404, 'Wrong Id', {'content-type' : 'text/plain'});
              res.end();
            }
          } else {
              res.writeHead( 400, 'Wrong Id', {'content-type' : 'text/plain'});
              res.end();
          }
        } catch {
          res.writeHead( 500, 'Server error', {'content-type' : 'text/plain'});
          res.end();
        }
      break;
    case req.url === `/api/users/${userId}` &&  req.method === 'DELETE':
      if (checkUuid(userId) && userId.length === 36) {
        if (dataBase[userId]) {
          delete dataBase[userId];
          updateDB(dataBase, 204, res, {}, 'Deleted');
        } else {
          res.writeHead( 404, 'Wrong Id', {'content-type' : 'text/plain'});
          res.end();
        }
      } else {
        res.writeHead( 400, 'Incorrect id', {'content-type' : 'text/plain'});
        res.end();
      }
      break;
    default:
      res.writeHead( 404, 'This page not found', {'content-type' : 'text/plain'});
      res.end();
      break;
  }
})
server.listen(PORT);