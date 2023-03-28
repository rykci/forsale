import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Landing from './Landing'
import { Client } from 'boardgame.io/react'
import { ForSale } from '../Game'
import { Board } from '../Board'
import { SocketIO } from 'boardgame.io/multiplayer'

function Room({ lobbyClient, playerToken, setPlayerToken, name, setName }) {
  let { roomID } = useParams()
  const navigate = useNavigate()
  const [matchData, setMatchData] = useState(null)
  const [matchStarted, setMatchStarted] = useState(false)
  const [clipboard, setClipboard] = useState(false)
  const [playerID, setPlayerID] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const match = await lobbyClient.getMatch('for-sale', roomID)
        setPlayerID(match.players.findIndex((player) => player.name == name))
        setMatchData(match)

        if (match.players.every((player) => player.name)) {
          console.log('starting!', match)
          setMatchData(match)
          setMatchStarted(true)
        }
      } catch (err) {
        console.log
        if (err.message == 'HTTP status 404') {
          alert('Room not found')
          roomID = ''
          navigate('/')
        }
      }
    }
    const interval = setInterval(() => {
      fetchData()
    }, 500)
    if (matchStarted) {
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [playerToken, matchStarted])

  const leaveRoom = async () => {
    let res = await lobbyClient.leaveMatch('for-sale', roomID, {
      playerID: playerID.toString(),
      credentials: playerToken,
    })

    console.log('res', res)
    roomID = ''
    navigate('/')
  }

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

  if (matchStarted && matchData.players.every((player) => player.name)) {
    // console.log('players', matchData.players)
    const ForSaleClient = Client({
      game: ForSale,
      board: Board,
      multiplayer: SocketIO({ server: 'localhost:8000' }),
      numPlayers: matchData.players.length,
    })
    return (
      <ForSaleClient
        matchID={roomID}
        playerID={playerID.toString()}
        credentials={playerToken}
      />
    )
  }

  return (
    <div className="flex flex-col justify-center align-middle w-screen min-h-screen bg-[url('/room-bg.png')] bg-cover bg-no-repeat bg-center ">
      <div className="flex flex-col justify-center align-middle w-4/5 lg:w-1/3 self-center p-4 gap-4 rounded-lg overflow-auto">
        <h2 className="text-center p-2 rounded-lg text-2xl font-bold">
          Waiting for Players...
        </h2>
        <div className="rounded-lg text-center w-1/2 self-center">
          <button
            className={`w-56 ${
              clipboard
                ? 'bg-white/30'
                : ' enabled:hover:text-white active:translate-y-1'
            } shadow-lg enabled:hover:bg-sky-600 enabled:hover:text-white active:translate-y-1`}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              setClipboard(true)
            }}
          >
            {clipboard ? 'Copied!' : 'Copy Link to Clipboard'}
          </button>
        </div>
        {matchData.players.map((player) => (
          <div
            key={player.id}
            className={` p-4 shadow-xl rounded-lg ${
              player.name ? 'bg-white' : 'bg-white/30'
            }`}
          >
            <span>{player.name ?? 'Waiting...'}</span>
          </div>
        ))}
        <button
          onClick={() => leaveRoom()}
          className="w-1/4 self-center shadow-lg enabled:hover:bg-sky-600 enabled:hover:text-white active:translate-y-1"
        >
          Leave Room
        </button>
      </div>
    </div>
  )
}

export default Room
