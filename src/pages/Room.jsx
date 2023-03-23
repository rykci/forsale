import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Landing from './Landing'

function Room({ lobbyClient, playerToken, setPlayerToken, name, setName }) {
  let { roomID } = useParams()
  const [matchData, setMatchData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const match = await lobbyClient.getMatch('for-sale', roomID)
      console.log(match)
      setMatchData(match)
    }

    fetchData()
  }, [playerToken])

  if (!playerToken) {
    return (
      <Landing
        roomID={roomID}
        lobbyClient={lobbyClient}
        setPlayerToken={setPlayerToken}
        name={name}
        setName={setName}
      />
    )
  }

  return (
    <div>
      <div>{name}</div>
      <div>{roomID}</div>
      <div>{playerToken}</div>
      {matchData ? (
        matchData.players.map((player) => (
          <div key={player.id}>name: {player.name}</div>
        ))
      ) : (
        <></>
      )}
    </div>
  )
}

export default Room
