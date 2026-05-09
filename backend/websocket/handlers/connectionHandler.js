require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const pool = require("../../db");
const WebSocket = require("ws");

const activeWorlds = new Map();

function connectionHandler(ws, req, wss) {
  try  {
    const url = new URL(req.url, "http://localhost");
    const token = url.searchParams.get("token");

    if (!token) {
      ws.close(1008, "token required");
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = decoded;

    ws.user = {
      id: user.id,
      username: user.username,
      role: user.role
    }
 

    console.log(`WS connected ${ws.user.username} (${ws.user.id})`);

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        console.log(data);

        switch (data.event) {
          case 'connection':
            activeWorlds.set(ws.user.id, {
              worldId: data.world_id,
              ws
            });
            break;
        }

      } catch(err) {
        console.log(`WS parse error, ${err.message}`);
      }
    });

    ws.on("close", () => {
      activeWorlds.delete(ws.user.id);
      console.log(`WS disconnected ${ws.user.username}`);
    })

    ws.on("error", (error) => {
      console.log(`WS error, ${error.message}`);
    })
  } catch(err) {
    console.log(`WS auth error: ${err.message}`);
    ws.close(1008, "invalid token");
  }
}

function startResourceUpdateLoop() {
  setInterval(async () => {
    try {
      const worldsMap = new Map();

      // группируем игроков по мирам
      for (const [, data] of activeWorlds) {
        const { worldId, ws } = data;

        if (!worldsMap.has(worldId)) {
          worldsMap.set(worldId, []);
        }

        worldsMap.get(worldId).push(ws);
      }

      // один запрос на мир
      for (const [worldId, sockets] of worldsMap) {

        await pool.query(`
          INSERT INTO world_resources (world_id, resource_id, amount)
          SELECT 
            $1,
            pr.resource_id,
            SUM(pr.amount_per_second * p.base_mining_rate * wpu.mining_level)
          FROM world_planets wp
          JOIN planets p ON wp.planet_id = p.id
          JOIN planet_resources pr ON wp.planet_id = pr.planet_id
          JOIN world_planets_upgrades wpu ON p.id = wpu.planet_id AND wp.world_id = wpu.world_id
          WHERE wp.world_id = $1
          GROUP BY pr.resource_id
          ON CONFLICT (world_id, resource_id)
          DO UPDATE SET 
            amount = world_resources.amount + EXCLUDED.amount;
        `, [worldId]);

        const resources = await pool.query(
          `SELECT 
            wr.resource_id,
            r.name,
            wr.amount
          FROM world_resources wr
          JOIN resources r ON wr.resource_id = r.id
          WHERE wr.world_id = $1`,
          [worldId]
        );

        for (const ws of sockets) {
          if (ws.readyState !== WebSocket.OPEN) continue;

          ws.send(JSON.stringify({
            event: "resources_update",
            resources: resources.rows
          }));
        }
      }

    } catch (err) {
      console.error("Ошибка resource update loop:", err);
    }
  }, 1000);
}

startResourceUpdateLoop();

module.exports = connectionHandler;