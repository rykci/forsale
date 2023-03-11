import React from 'react'

function Card({ value }) {
  return (
    <div
      className={`bg-yellow-200 flex border-2 rounded-lg h-36 w-28 text-center justify-center items-center text-4xl font-bold`}
    >
      <div>{value}</div>
    </div>
  )
}

export default Card
