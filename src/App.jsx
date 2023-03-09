import { Client } from 'boardgame.io/react'
import { ForSale } from './Game'

const App = Client({ game: ForSale, numPlayers: 4 })

export default App
