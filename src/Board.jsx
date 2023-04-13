import React, { useEffect, useState } from 'react'
import Card from './components/Card'
import { useNavigate } from 'react-router-dom'

export function Board(props) {
  const navigate = useNavigate()
  const { ctx, G, moves, matchData, playerID } = props

  const [bid, setBid] = useState(0)
  const [hoverCard, setHoverCard] = useState(false)

  useEffect(() => {
    setBid(1)
    if (ctx.phase == 'selling' && G.selling[playerID] == 0) {
      setHoverCard(true)
    }
  }, [ctx.phase])

  useEffect(() => {
    setBid(G.players[G.highestBidder].bid + 1)
  }, [G.highestBidder])

  const pickCard = (card) => {
    if (G.selling[playerID] == 0) {
      setHoverCard(false)
      moves.PickCard(card)
    }
  }

  if (ctx.gameover) {
    return (
      <div className="flex flex-col min-h-screen w-screen bg-amber-50 justify-center align-middle gap-y-8 ">
        {Object.values(G.players).map((player, pid) => (
          <div className="rounded-xl p-10 flex gap-8  bg-[url('/wood.jpeg')] bg-cover bg-no-repeat shadow-2xl self-center flex-col w-1/4 ">
            <div
              key={pid}
              className="text-white flex align-middle gap-x-10 justify-between"
            >
              <div className="">
                <div>{matchData[pid].name}</div>
                <div>Coins: {player.coins}</div>
              </div>
              <div className=" flex flex-col justify-center align-middle text-center ">
                {ctx.gameover.winner && ctx.gameover.winner == pid
                  ? 'Winner!'
                  : ''}
              </div>
            </div>
          </div>
        ))}

        <button
          className="self-center text-white bg-[url('/wood.jpeg')] hover:px-8"
          onClick={() => navigate('/')}
        >
          Leave Room
        </button>
      </div>
    )
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
            <div className="w-1/6 flex flex-col gap-y-2" key={pid}>
              <div
                className={`p-4 rounded-xl bg-[url('/wood.jpeg')] bg-cover bg-no-repeat shadow-2xl text-white flex justify-between`}
              >
                <div>
                  <div className="font-semibold text-xl">
                    {matchData[pid].name}
                  </div>
                  <div>Coins: {player.coins}</div>
                  <div>
                    {ctx.phase != 'buying'
                      ? ''
                      : player.hasPassed
                      ? 'Passed'
                      : 'Bid: ' + player.bid}
                  </div>
                </div>
                <div>
                  {ctx.phase == 'buying' && G.players[pid].hasPassed ? (
                    <Card
                      size="small"
                      value={
                        G.players[pid].cards[G.players[pid].cards.length - 1]
                      }
                    />
                  ) : ctx.phase == 'selling' ? (
                    G.selling[pid] == 0 ? (
                      <Card size="small" color="blank" />
                    ) : pid == playerID ? (
                      <Card size="small" value={G.selling[pid]} />
                    ) : (
                      <Card size="small" value="?" />
                    )
                  ) : ctx.phase == 'readyUp' &&
                    (G.deck.length > 0 ||
                      G.auction.length > 0 ||
                      (ctx.numPlayers == 3 && G.priceDeck.length == 24) ||
                      (ctx.numPlayers == 3 && G.priceDeck.length >= 28)) ? (
                    <Card
                      size="small"
                      value={
                        G.players[pid].cards[G.players[pid].cards.length - 1]
                      }
                    />
                  ) : ctx.phase == 'readyUp' ? (
                    <div className="flex gap-1">
                      <Card size="small" value={G.selling[pid]} />
                      <Card
                        size="small"
                        color="green"
                        value={G.prices[G.sortedSelling[pid]]}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div
                    className={`text-right pt-1 pr-1 ${
                      ctx.phase == 'readyUp' && G.ready[pid]
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  >
                    Ready
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center   md:flex-row md:justify-evenly">
        <div>
          <h2 className="text-4xl font-semibold text-center">
            {ctx.phase == 'selling' && G.selling[playerID] == 0
              ? 'Pick one of your cards...'
              : ctx.phase == 'buying'
              ? props.playerID == ctx.currentPlayer
                ? 'Your Turn...'
                : `${matchData[ctx.currentPlayer].name}'s Turn...`
              : ''}
          </h2>
          <div className="rounded-xl p-10 flex gap-4  bg-[url('/wood.jpeg')] bg-cover bg-no-repeat shadow-2xl justify-center">
            {ctx.phase == 'readyUp' && !G.ready[playerID] ? (
              <button
                className="hover:bg-sky-600 hover:text-white"
                onClick={() => moves.Ready()}
              >
                {'Ready'}
              </button>
            ) : ctx.phase == 'selling' ? (
              G.prices.map((n) => <Card color="green" key={n} value={n} />)
            ) : (
              G.auction.map((n) => <Card className="" key={n} value={n} />)
            )}
          </div>
        </div>
        {playerID == ctx.currentPlayer && ctx.phase == 'buying' ? (
          <div className="flex flex-row gap-4 p-4  bg-[url('/wood.jpeg')] rounded-xl">
            <div className="">
              <button
                className="w-full h-full px-8 active:translate-y-1 hover:bg-red-300"
                onClick={() => moves.Pass()}
              >
                Pass
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="w-full active:translate-y-1 hover:bg-green-300"
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
                <div className="text-2xl text-white font-semibold">{bid}</div>
                <button
                  className="enabled:active:translate-y-1 disabled:bg-white/30 disabled:text-gray-500"
                  onClick={() => setBid(bid + 1)}
                  disabled={bid >= G.players[playerID].coins}
                >
                  {'>'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* Player Hand*/}
      <div className="p-8 flex flex-col gap-2">
        <div className="text-3xl font-semibold">Your Cards:</div>
        <div className="flex gap-x-2">
          {G.players[playerID].cards.map((card) => (
            <div
              key={card}
              onClick={() => pickCard(card)}
              className={`${hoverCard ? 'hover:-translate-y-4' : ''}`}
            >
              <Card className="" value={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
