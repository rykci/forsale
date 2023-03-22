import { Client } from 'boardgame.io/react'
import { LobbyClient } from 'boardgame.io/client'
import { ForSale } from './Game'
import { Board } from './Board'
import { SocketIO } from 'boardgame.io/multiplayer'
import Landing from './components/Landing'

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' })

const ForSaleClient = Client({
  game: ForSale,
  board: Board,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
})

const App = () => {
  return (
    <div className="flex flex-col justify-center align-middle w-screen h-screen bg-[url('/for-sale-bg.jpeg')] bg-cover">
      <Landing lobbyClient={lobbyClient} />
      {/*<ForSaleClient numPlayers='4' />*/}
    </div>
  )
}

export default App
