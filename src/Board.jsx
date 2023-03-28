import React, { useEffect } from 'react'
import Card from './components/Card'

export function Board(props) {
  const { ctx, G, moves, matchData } = props

  return (
    <div className="flex flex-col h-screen w-screen bg-amber-700">
      <div className="">
        {matchData.map((player) =>
          player.isConnected ? (
            <div></div>
          ) : (
            <div className=" p-2 text-white">
              {player.name} has left the game...
            </div>
          ),
        )}
      </div>

      <div className=" h-screen flex flex-col justify-center items-center">
        <h1>{matchData[ctx.currentPlayer].name}'s Turn...</h1>
        <div className="rounded-xl border-2 p-10 flex gap-4  bg-[url('/wood.jpeg')] bg-cover bg-no-repeat shadow-2xl">
          {props.G.auction.map((n) => (
            <Card className="" key={n} value={n} />
          ))}
        </div>
        <div>d1</div>
        {console.log('props', props)}

        {console.log('ctx', ctx)}
        <div>d2</div>
      </div>
    </div>
  )
}
