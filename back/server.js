const http = require("http");
const app = require("./app");

const env = require("./managers/env");
if (!env.PORT) console.log("PORT should be set in .env");
const { PORT = 3000 } = env;
//const PORT = process.env.PORT || 3000;

app.set("port", PORT);
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listen on http://localhost:${PORT}/`);
});
