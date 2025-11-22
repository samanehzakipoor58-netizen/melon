"use client "

import React, { Children } from 'react'

type Iprops ={
    onClick: () => void
    children: React.ReactNode
}

const BlueButton = ({onClick , children }:Iprops) => {
  return (
    <button onClick={onClick} className="bg-gray-500 p-3 rounded-full text-black hover:bg-white transition-colors duration-300">
       {children}
    </button>
  )
}

export default BlueButton