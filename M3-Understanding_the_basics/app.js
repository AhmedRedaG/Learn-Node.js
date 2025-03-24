const http = require("http");

const routes = require("./routes.js");

const server = http.createServer(routes.handler);

const port = 3000;
server.listen(port, () => {
  console.log("Server is running on port " + port);
});
