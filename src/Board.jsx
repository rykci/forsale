import React from 'react'
import Card from './components/Card'

export function Board(props) {
  return (
    <div className='flex flex-col h-screen w-screen '>
      <h1 className='text-center'>For Sale!</h1>
      <div className='border-2 h-screen flex flex-col justify-center items-center'>
        <div className=' border-2 p-8 flex gap-4'>
          {props.G.auction.map((n) => (
            <Card className='' key={n} value={n} />
          ))}
        </div>
        <div>d1</div>
        {console.log(props)}
        <div>d2</div>
      </div>
    </div>
  )
}
