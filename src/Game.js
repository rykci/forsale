import { INVALID_MOVE, TurnOrder } from 'boardgame.io/core'

const Bid = ({ G, playerID }, amount) => {
  if (G.bids[G.highestBidder] >= amount) {
    return INVALID_MOVE
  }

  console.log(`${playerID} BIDDING ${amount}`)
  G.players[playerID].coins -= amount
  G.bids[playerID] = amount
  G.highestBidder = playerID
}

const Pass = ({ G, playerID, events }) => {
  G.bidding[playerID] = false
  G.players[playerID].coins += Math.floor(G.bids[playerID] / 2)
  G.players[playerID].cards.push(G.auction.pop())

  if (G.auction.length == 1) {
    events.endPhase()
  }
}

export const ForSale = {
  minPlayers: 3,
  maxPlayers: 6,
  setup: ({ random, ctx }) => {
    let deck = random
      .Shuffle([...Array(31).keys()].slice(1))
      .slice(30 % ctx.numPlayers)

    let initialAmount = 14
    if (ctx.numPlayers == 5) {
      initialAmount = 16
    } else if (ctx.numPlayers == 4) {
      initialAmount = 21
    } else {
      initialAmount = 28
    }

    let players = {}

    for (let i = 0; i < ctx.numPlayers; i++) {
      players[i] = { coins: initialAmount, cards: [] }
    }

    return { deck, players }
  },

  phases: {
    buying: {
      turn: { minMoves: 1, maxMoves: 1 },
      onBegin: ({ G, ctx }) => {
        G.auction = G.deck.splice(0, ctx.numPlayers).sort((a, b) => b - a)
        G.highestBidder = 0
        G.bids = new Array(ctx.numPlayers).fill(0)
        G.bidding = new Array(ctx.numPlayers).fill(true)
      },
      start: true,
      moves: { Bid, Pass },
      next: ({ G }) => {
        return G.deck.length == 0 ? 'selling' : 'buying'
      },
    },
  },
}

// TODO:
// - skip players who passed
// - start round robin turn order on winner of last round
