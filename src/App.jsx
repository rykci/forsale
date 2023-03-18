import { Client } from 'boardgame.io/react'
import { ForSale } from './Game'
import { Board } from './Board'
import { SocketIO } from 'boardgame.io/multiplayer'
import Landing from './components/Landing'

const ForSaleClient = Client({
  game: ForSale,
  board: Board,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
})

const App = () => {
  return (
    <div>
      <Landing />
      {/*<ForSaleClient numPlayers='4' />*/}
    </div>
  )
}

export default App
