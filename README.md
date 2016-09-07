# chat-server
Server side server and API for chat. Live demo: http://trafchat.herokuapp.com/

## How-To:
To run the project you need to manually include dbconfig.js at project root directory which exports MySQL database settings.

### Example:
```
module.exports = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat'
};
```