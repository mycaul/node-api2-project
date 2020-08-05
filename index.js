const express = require('express')

const router = require('./router')

const server = express()
server.use(express.json())

server.get('/',(req, res) => {
  res.send(`<h1>Working</h1>`)
})

server.use('/api/posts', router)

const PORT = 8000;
server.listen(PORT, ()=>{
  console.log(`server listening on port ${PORT}`)
})