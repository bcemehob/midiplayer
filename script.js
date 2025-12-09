const { createServer } = require("./src-backend/server");

const app = createServer();

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});