var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var qs = require('querystring');

var actions = require('./lib/actions');

var dbconfig = require('./dbconfig');

var mysql = require('mysql');

var db;

function createTables() {
  var query = "CREATE TABLE IF NOT EXISTS `chat_users` (" +
              "`id` INT NOT NULL AUTO_INCREMENT," +
              "`name` VARCHAR(45) NULL UNIQUE," +
              "`last_activity` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP," +
              "PRIMARY KEY (`id`)," +
              "UNIQUE INDEX `id_UNIQUE` (`id` ASC));";

  db.query(query, function(err) {
    if (err) {
      throw err;
    } else {
      console.log("Table chat_users successfully created");
    }
  });

  query = "CREATE TABLE IF NOT EXISTS `chat_messages` (" +
          "`id` INT NOT NULL AUTO_INCREMENT," +
          "`author` VARCHAR(45) NULL," +
          "`text` VARCHAR(255) NULL," +
          "`timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP," +
          "PRIMARY KEY (`id`)," +
          "UNIQUE INDEX `id_UNIQUE` (`id` ASC));";

  db.query(query, function(err) {
    if (err) {
      throw err;
    } else {
      console.log("Table chat_messages successfully created");
    }
  });
}

function connectToDB() {
  console.log('Connecting to DB...');
  db = mysql.createConnection(dbconfig);

  db.on('error', function(err) {
    console.log('Error DB: ' + err.code);
    if (err.code == 'PROTOCOL_CONNECTION_LOST') {
      connectToDB();
    } else {
      throw err;
    }
  });

  db.connect(function(err) {
    if (err) {
      console.log('Error connecting to DB: ' + err);
      setTimeout(connectToDB, 2000);
    } else {
      createTables();
    }
  });
}

connectToDB();

var server = http.createServer(function(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;
  const query = parsedUrl.query;

  switch (req.method) {
    case 'POST': {
      switch (pathName) {
        case '/': {
          // actions.add()
          break;
        }
        case '/ajax': {
          postAjax(query, req, res);
          break;
        }
      }
      break;
    }
    case 'GET': {
      switch(pathName) {
        case '/': {
          serveStatic('/index.html', res);
          break;
        }
        case '/ajax': {
          getAjax(query, res);
          break;
        }
        default: {
          serveStatic(pathName, res);
          break;
        }
      }
      break;
    }
  }
}).listen(process.env.PORT || 8081);

function serveStatic(pathName, res) {
  fs.exists('./public' + pathName, function(exists) {
    if (!exists) {
      console.log('File ' + pathName + ' does not exist.');
      return send404(res);
    } else {
      fs.createReadStream('./public' + pathName).pipe(res);
    }
  });
}

function getAjax(query, res) {
  if (!query.action) return send404(res);

  const action = query.action;

  switch (action) {
    case 'getMessages': {
      const lastID = query.lastID || '0';
      actions.getMessages(db, res, lastID);
      break;
    }
    default: {
      send404(res);
      break;
    }
  }
}

function postAjax(query, req, res) {
  if (!query.action) return send404(res);

  const action = query.action;

  switch (action) {
    case 'getUsers': {
      actions.getUsers(db, res);
      getPOSTData(req, function(data) {
        actions.update(db, data.name);
      });
      break;
    }
    case 'login': {
      getPOSTData(req, function(data) {
        actions.login(db, res, data.name);
      });
      break;
    }
    case 'submitMessage': {
      getPOSTData(req, function(data) {
        actions.submitMessage(db, res, data);
      });
      break;
    }
    default: {
      send404(res);
      break;
    }
  }
}


function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404: Requested file not found.');
}

function getPOSTData(req, callback) {
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    var parsedData = qs.parse(data);
    callback(parsedData);
  });
}