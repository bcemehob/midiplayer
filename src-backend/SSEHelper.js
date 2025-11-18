let clients = []

function registerUiClient(req, res) {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()
  clients.push(res)
  req.on("close", () => {
    clients = clients.filter(client => client !== res)
  })
}

function emitEvent(event) {
  console.log("event", event)
  clients.forEach(client => client.write(`data: ${JSON.stringify(event)}\n\n`))
}

module.exports = { registerUiClient, emitEvent }
