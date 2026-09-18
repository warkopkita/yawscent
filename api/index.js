const server = require("../web/server");

module.exports = (req, res) => {
  server.emit("request", req, res);
};
