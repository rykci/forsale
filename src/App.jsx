import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Client, Lobby } from 'boardgame.io/react'
import { LobbyClient } from 'boardgame.io/client'
import { ForSale } from './Game'
import { Board } from './Board'
import { SocketIO } from 'boardgame.io/multiplayer'
import Landing from './pages/Landing'
import { useState } from 'react'
import Room from './pages/Room'

const ForSaleClient = Client({
  game: ForSale,
  board: Board,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
})

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' })

const App = () => {
  const [name, setName] = useState('')
  const [numPlayers, setNumPlayers] = useState(3)
  const [playerToken, setPlayerToken] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Landing
              lobbyClient={lobbyClient}
              name={name}
              setName={setName}
              numPlayers={numPlayers}
              setNumPlayers={setNumPlayers}
              setPlayerToken={setPlayerToken}
            />
          }
        />
        <Route
          path="/room/:roomID"
          element={
            <Room
              lobbyClient={lobbyClient}
              playerToken={playerToken}
              setPlayerToken={setPlayerToken}
              name={name}
              setName={setName}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
