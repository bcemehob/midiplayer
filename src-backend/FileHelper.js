const path = require("path")

function download (req, res) {
    const { folder, file } = req.params
    const filePath = path.join(process.cwd(), "extracted", folder, file)

    res.download(filePath, file, (err) => { 
      if (err) {
        res.status(404).json({ error: "File not found" })
      }
    })
  }

  module.exports = { download }