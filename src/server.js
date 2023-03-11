// src/server.js
const { Server, Origins } = require('boardgame.io/server')
const { ForSale } = require('./Game')

const server = Server({
  games: [ForSale],
  origins: [Origins.LOCALHOST],
})

server.run(8000)
