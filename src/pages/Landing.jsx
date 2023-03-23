import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Landing({
  lobbyClient,
  name,
  setName,
  numPlayers,
  setNumPlayers,
  setPlayerToken,
  roomID,
}) {
  const navigate = useNavigate()
  const [gameID, setGameID] = useState(roomID)

  useEffect(() => {
    if (gameID) {
      navigate(`/room/${gameID}`)
    }
  }, [gameID])

  useEffect(() => {
    const fetchMatches = async () => {
      const { matches } = await lobbyClient.listMatches('for-sale')
      console.log(matches)
    }

    fetchMatches()
  }, [])

  const createMatch = async () => {
    // if game id exists i.e landing page from room, use existing game id
    // else create a new match ID
    try {
      const { matchID } = gameID
        ? { matchID: gameID }
        : await lobbyClient.createMatch('for-sale', {
            numPlayers: parseInt(numPlayers),
          })

      // either way, we join the match
      const { playerCredentials } = await lobbyClient.joinMatch(
        'for-sale',
        matchID,
        { playerName: name },
      )

      setPlayerToken(playerCredentials)
      setGameID(matchID)
    } catch (err) {
      if (err.message == 'HTTP status 409') {
        alert('Room is full')
      }
    }
  }

  return (
    <div className="flex flex-col justify-center align-middle w-screen h-screen bg-[url('/for-sale-bg.jpeg')] bg-cover">
      <div className="flex flex-col justify-center align-middle border-2 w-1/2 self-center p-8 gap-4 rounded-lg bg-slate-200/50">
        <h1 className="">For Sale</h1>
        <input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <button onClick={() => createMatch()}>
            {roomID ? 'Join Room' : 'Create Room'}
          </button>
          {roomID ? (
            <></>
          ) : (
            <select
              className="p-3 rounded-lg"
              value={numPlayers}
              onChange={(e) => setNumPlayers(e.target.value)}
            >
              Number of Players
              <option value={3}>3 players</option>
              <option value={4}>4 players</option>
              <option value={5}>5 players</option>
              <option value={6}>6 players</option>
            </select>
          )}
        </div>
      </div>
    </div>
  )
}

export default Landing
