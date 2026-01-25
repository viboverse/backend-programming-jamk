import http from "http";
import { getSystemInfo } from "./system-utils.js";

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const url = req.url;

  if (url === "/api/system") {
    const osInfo = await getSystemInfo();
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(osInfo, null, 2));
  } else if (url === "/api/time") {
    const now = new Date();

    const timeData = {
      iso: now.toISOString(),
      unix: Math.floor(now.getTime() / 1000),
    };

    res.writeHead(200, { "content-type": "application/json" });

    res.end(JSON.stringify(timeData, null, 2));
  } else if (url === "/") {
    res.writeHead(200, { "content-type": "text/html" });

    res.end(`
      <h1>Welcome to System Info API</h1>
      <ul>
        <li><a href="/api/system">System Information</a></li>
        <li><a href="/api/time">Current Time</a></li>
      </ul>
    `);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });

    res.end("404! PAGE NOT FOUND");
  }
});

server.listen(PORT);
