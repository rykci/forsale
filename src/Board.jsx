import React from 'react'
import Card from './components/Card'

export function Board(props) {
  return (
    <div className="flex flex-col h-screen w-screen bg-amber-700">
      <div className="border-2 h-screen flex flex-col justify-center items-center">
        <div className="rounded-xl border-2 p-10 flex gap-4  bg-[url('/wood.jpeg')] bg-cover bg-no-repeat shadow-2xl">
          {props.G.auction.map((n) => (
            <Card className="" key={n} value={n} />
          ))}
        </div>
        <div>d1</div>
        {console.log(props)}
        <div>d2</div>
      </div>
    </div>
  )
}
