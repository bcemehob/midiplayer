const { createServer } = require("./src-backend/server.js");

const app = createServer();

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});