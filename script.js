const { createMidiServer } = require("./src-backend/midiServer.js");

const app = createMidiServer();

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});