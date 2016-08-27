
module.exports.getMessages = function(db, res, lastID) {

  const query = "SELECT * FROM chat_messages WHERE id > " + lastID;

  db.query(query, function(err, data) {
    if (err) throw err;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    res.write(JSON.stringify(data));

    res.end();
  });
};

module.exports.getUsers = function(db, res) {

  const deleteInactiveQuery = "DELETE FROM chat_users WHERE last_activity < SUBTIME(NOW(), '0:0:10')";
  db.query(deleteInactiveQuery);

  const getUsersQuery = "SELECT (name) FROM chat_users";
  db.query(getUsersQuery, function(err, users) {
    if (err) throw err;

    const data = {};
    data.users = users;
    data.count = users.length;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    res.write(JSON.stringify(data));

    res.end();
  });
};

module.exports.login = function(db, res, name) {

  const query = "INSERT INTO chat_users (name) VALUES ('" + name + "')"
    + "ON DUPLICATE KEY UPDATE last_activity = NOW()";

  db.query(query, function(err) {
    if (err) throw err;

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  });
};

module.exports.update = function(db, name) {
  const query = "INSERT INTO chat_users (name) VALUES ('" + name + "')"
    + "ON DUPLICATE KEY UPDATE last_activity = NOW()";

  db.query(query);
}

module.exports.submitMessage = function(db, res, message) {
  const query = "INSERT INTO chat_messages (author, text) VALUES ('"
    + message.author + "','"
    + message.text + "')";

  db.query(query, function(err) {
    if (err) throw err;

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  });
}