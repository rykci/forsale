import { Client } from 'boardgame.io/react'
import { ForSale } from './Game'
import { Board } from './Board'
import { SocketIO } from 'boardgame.io/multiplayer'

const App = Client({
  game: ForSale,
  numPlayers: 4,
  board: Board,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
})

export default App
