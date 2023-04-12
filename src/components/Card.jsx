import React from 'react'

function Card({ color = 'yellow', value, size = 'large' }) {
  const colorVariants = {
    yellow: 'bg-gradient-to-tr from-yellow-500 to-yellow-200',
    green: 'bg-gradient-to-br  from-green-600 to-green-400',
    blank: '',
  }

  const sizeVariants = {
    large: 'h-36 w-28',
    small: 'p-2',
  }

  return (
    <div
      className={`${colorVariants[color]} flex rounded-lg ${sizeVariants[size]} text-center justify-center items-center text-4xl font-bold`}
    >
      <div className="text-black">{value}</div>
    </div>
  )
}

export default Card
