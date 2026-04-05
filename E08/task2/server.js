import app from "./app.js";
import http from "http";
import { PORT } from "./utils/config.js";

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
