import React, { useEffect, useState } from 'react'

function Landing({ lobbyClient }) {
  const [gameID, setGameID] = useState('')
  useEffect(() => {
    const fetchMatches = async () => {
      const { matches } = await lobbyClient.listMatches('for-sale')
      console.log(matches)
    }

    fetchMatches()
  }, [])

  const createMatch = async () => {
    const { matchID } = await lobbyClient.createMatch('for-sale', {
      numPlayers: 4,
    })
    setGameID(matchID)
  }

  return (
    <div className="flex flex-col justify-center align-middle border-2 w-1/2 self-center p-8 gap-4 rounded-lg bg-slate-200/50">
      <h1 className="">For Sale</h1>
      <div>
        <button onClick={() => createMatch()}>Create Room</button>
        <button>Join Room</button>
      </div>
      {gameID}
    </div>
  )
}

export default Landing
