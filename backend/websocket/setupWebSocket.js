const { WebSocketServer } = require("ws");
const connectionHandler = require("./handlers/connectionHandler");

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    connectionHandler(ws, req, wss);
  })
}

module.exports = setupWebSocket;