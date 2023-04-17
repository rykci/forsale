import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LobbyClient } from 'boardgame.io/client'
import Landing from './pages/Landing'
import { useState } from 'react'
import Room from './pages/Room'

const serverHost = 'http://localhost:8000'

const lobbyClient = new LobbyClient({
  server: serverHost,
})

const App = () => {
  const [name, setName] = useState('')
  const [numPlayers, setNumPlayers] = useState(3)
  const [playerToken, setPlayerToken] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
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
          path='/room/:roomID'
          element={
            <Room
              lobbyClient={lobbyClient}
              playerToken={playerToken}
              setPlayerToken={setPlayerToken}
              name={name}
              setName={setName}
              serverHost={serverHost}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
