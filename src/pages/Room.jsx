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

  // #9ACDDA
  // #77BDDF

  if (!matchData) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col justify-center align-middle w-screen min-h-screen bg-[url('/room-bg.png')] bg-cover bg-no-repeat bg-center ">
      <div className="flex flex-col justify-center align-middle w-4/5 lg:w-1/3 self-center p-4 gap-4 rounded-lg overflow-auto">
        <h2 className="text-center p-2 rounded-lg text-2xl font-bold">
          {matchData.players[matchData.players.length - 1].name
            ? 'Waiting to Start'
            : 'Waiting for Players...'}
        </h2>
        <div
          className={`rounded-lg text-center ${
            matchData.players[0].name == name
              ? 'flex justify-between'
              : 'w-1/2 self-center'
          }`}
        >
          <button className="">Copy Link to Clipboard</button>
          {matchData.players[0].name == name ? (
            <button
              disabled={!matchData.players[matchData.players.length - 1].name}
              className="w-1/3 disabled:bg-white/30 "
            >
              Start
            </button>
          ) : (
            <></>
          )}
        </div>
        {matchData.players.map((player) => (
          <div
            key={player.id}
            className={` p-4 rounded-lg ${
              player.name ? 'bg-white' : 'bg-white/30'
            }`}
          >
            <span>{player.name ?? 'Waiting...'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Room
