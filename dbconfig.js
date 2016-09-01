localConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '6334803',
  database: 'chat'
};

herokuConfig = {
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'bc5b1f64c4d8ee',
  password: '72b466d5',
  database: 'heroku_8cc4db1fe271d2f'
};

//mysql://bc5b1f64c4d8ee:72b466d5@us-cdbr-iron-east-04.cleardb.net/heroku_8cc4db1fe271d2f?reconnect=true
module.exports = herokuConfig;