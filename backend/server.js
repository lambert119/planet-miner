require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler")

const setupWebSocket = require("./websocket/setupWebSocket")
const authRoutes = require("./routes/authRoutes");
const worldsRoutes = require("./routes/worldsRoutes");
const resourcesRoutes = require("./routes/resourcesRoutes");
const planetsRoutes = require("./routes/planetsRoutes");
const upgradeRoutes = require("./routes/upgradesRoutes");

const PORT = process.env.PORT;
const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());
app.use(logger);

app.use("/auth", authRoutes);
app.use("/worlds", worldsRoutes);
app.use("/resources", resourcesRoutes);
app.use("/planet", planetsRoutes);
app.use("/upgrade", upgradeRoutes);

app.use(errorHandler);

const server = http.createServer(app);

setupWebSocket(server);

server.listen(PORT, () => console.log(`Server started on: ${PORT}`));