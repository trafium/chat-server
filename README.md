# chat-server
To run the project you need to manually include dbconfig.js at project root directory which exports MySQL database settings.

Example:
module.exports = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat'
};