import React from 'react'

function Card({ color = 'yellow', value }) {
  const colorVariants = {
    yellow: 'bg-gradient-to-tr from-yellow-500 to-yellow-200',
    green: 'bg-gradient-to-br  from-green-600 to-green-400',
  }

  return (
    <div
      className={`${colorVariants[color]} flex border-2 rounded-lg h-36 w-28 text-center justify-center items-center text-4xl font-bold`}
    >
      <div>{value}</div>
    </div>
  )
}

export default Card
