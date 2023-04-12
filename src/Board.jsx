import React, { useEffect, useState } from 'react'
import Card from './components/Card'

export function Board(props) {
  const { ctx, G, moves, matchData, playerID } = props

  const [bid, setBid] = useState(0)

  useEffect(() => {
    setBid(G.players[G.highestBidder].bid + 1)
  }, [G.highestBidder])

  const pickCard = (card) => {
    if (G.selling[playerID] == 0) {
      moves.PickCard(card)
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-amber-50 justify-between ">
      <div className="flex justify-between p-8">
        {/* <div className="log pl-2">
          {matchData.map((player) =>
            player.isConnected ? (
              <></>
            ) : (
              <div className="p-2 text-black">
                {player.name} has left the game...
              </div>
            ),
          )}
        </div> */}
        <div className="flex justify-evenly flex-1 gap-x-8">
          {Object.values(G.players).map((player, pid) => (
            <div
              key={pid}
              className={`p-4 rounded-xl w-1/6 bg-[url('/wood.jpeg')] bg-cover bg-no-repeat shadow-2xl text-white ${
                pid == ctx.currentPlayer ? ' shadow-amber-900' : ''
              }`}
            >
              <div className="font-semibold text-xl">{matchData[pid].name}</div>
              <div>Coins: {player.coins}</div>
              <div>
                {ctx.phase == 'selling'
                  ? ''
                  : player.hasPassed
                  ? 'Passed'
                  : 'Bid: ' + player.bid}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-y-8 border-2 md:flex-row md:justify-evenly">
        <div>
          <h2 className="text-4xl font-semibold text-center">
            {ctx.phase == 'selling'
              ? 'Pick one of your cards...'
              : props.playerID == ctx.currentPlayer
              ? 'Your Turn...'
              : `${matchData[ctx.currentPlayer].name}'s Turn...`}
          </h2>
          <div className="rounded-xl p-10 flex gap-4  bg-[url('/wood.jpeg')] bg-cover bg-no-repeat shadow-2xl justify-center">
            {ctx.phase == 'selling'
              ? G.prices.map((n) => <Card color="green" key={n} value={n} />)
              : G.auction.map((n) => <Card className="" key={n} value={n} />)}
          </div>
        </div>
        {playerID == ctx.currentPlayer && ctx.phase == 'buying' ? (
          <div className="flex flex-row gap-4 p-4 border-2 border-red-200">
            <div className="flex flex-col gap-2">
              <button
                className="w-full active:translate-y-1"
                onClick={() => moves.Bid(bid)}
              >
                Bid
              </button>
              <div className="flex flex-row items-center gap-x-4">
                <button
                  className="enabled:active:translate-y-1 disabled:bg-white/30 disabled:text-gray-500"
                  onClick={() => setBid(bid - 1)}
                  disabled={bid <= G.players[G.highestBidder].bid + 1}
                >
                  {'<'}
                </button>
                <div className="text-2xl font-semibold">{bid}</div>
                <button
                  className="enabled:active:translate-y-1 disabled:bg-white/30 disabled:text-gray-500"
                  onClick={() => setBid(bid + 1)}
                  disabled={bid >= G.players[playerID].coins}
                >
                  {'>'}
                </button>
              </div>
            </div>
            <div className="">
              <button
                className="w-full h-full px-8 active:translate-y-1"
                onClick={() => moves.Pass()}
              >
                Pass
              </button>
            </div>
          </div>
        ) : ctx.phase == 'selling' && G.selling[playerID] > 0 ? (
          <Card value={G.selling[playerID]} />
        ) : (
          <></>
        )}
      </div>
      {/* Player Hand*/}
      <div className="p-8 flex flex-col gap-2">
        <div className="text-3xl font-semibold">Your Cards:</div>
        <div className="flex gap-x-2">
          {G.players[playerID].cards.map((card) => (
            <div onClick={() => pickCard(card)}>
              <Card className="" key={card} value={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
