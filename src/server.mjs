import { Server, Origins } from 'boardgame.io/dist/cjs/server.js'
import { ForSale } from './Game.js'

const server = Server({
  games: [ForSale],
  origins: [Origins.LOCALHOST],
})

const PORT = 8000 // Replace with your desired port number.
server.run(PORT)
