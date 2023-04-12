import { INVALID_MOVE, TurnOrder } from 'boardgame.io/dist/cjs/core.js'

const PickCard = ({ G, ctx, playerID, events }, card) => {
  const index = G.players[playerID].cards.indexOf(card)
  if (index == -1) {
    return INVALID_MOVE
  }

  G.selling[playerID] = card
  G.players[playerID].cards.splice(index, 1)

  if (!G.selling.includes(0)) {
    let sortedPlayers = sortPlayersByHouse(G.selling)
    console.log(sortedPlayers)
    G.sortedSelling = sortedPlayers

    for (let i = 0; i < ctx.numPlayers; i++) {
      console.log(G.prices[i])

      G.players[i].coins += G.prices[sortedPlayers[i]]
    }

    events.endPhase()
  }
}

function sortPlayersByHouse(toSort) {
  // Create an array of pairs, where the first element is the value and the second element is the original index
  const indexedArray = toSort.map((val, index) => [val, index])

  // Sort the array of pairs by the values, in descending order
  indexedArray.sort((a, b) => b[0] - a[0])

  // Extract the original indices from the sorted array of pairs and return as an array
  return indexedArray.map((pair) => pair[1])
}

const Bid = ({ G, playerID }, amount) => {
  if (
    G.players[playerID].bid + G.players[playerID].coins <=
    G.players[G.highestBidder].bid
  ) {
    return INVALID_MOVE
  }

  if (G.players[G.highestBidder].bid >= amount) {
    return INVALID_MOVE
  }

  console.log(`PLAYER ${playerID} BIDS ${amount} COIN`)
  G.players[playerID].coins -= amount - G.players[playerID].bid
  G.players[playerID].bid = amount
  G.highestBidder = playerID
}

const Pass = ({ G, playerID, events, ctx }) => {
  console.log(`PLAYER ${playerID} PASSED`)
  G.players[playerID].hasPassed = true
  G.players[playerID].coins += Math.floor(G.players[playerID].bid / 2)
  let pickup = G.auction.pop()
  G.players[playerID].cards.push(pickup)

  console.log(`PLAYER ${playerID} PICKS UP ${pickup}`)

  if (G.auction.length == 1) {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.players[i].hasPassed == false) {
        G.highestBidder = i
        G.players[i].cards.push(G.auction.pop())
        break
      }
    }
    events.endPhase()
  }
}

const Ready = ({ G, playerID, events }) => {
  G.ready[playerID] = true
  if (G.ready.every((value) => value === true)) {
    events.endPhase()
  }
}

export const ForSale = {
  name: 'for-sale',
  minPlayers: 3,
  maxPlayers: 6,
  setup: ({ random, ctx }) => {
    let deck = random
      .Shuffle([...Array(31).keys()].slice(1))
      .slice(30 % ctx.numPlayers)

    let priceDeck = [...Array(16).keys(), ...Array(15).keys()].slice(1)
    priceDeck[0] = 0
    priceDeck[16] = 15
    priceDeck = random.Shuffle(priceDeck).slice(30 % ctx.numPlayers)

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

    // FOR TESTING (FAST FORWARD BUYING)
    // let len = deck.length
    // for (let i = 0; i < ctx.numPlayers; i++) {
    //   players[i].cards = deck.splice(0, len / ctx.numPlayers - 2)
    // }

    return {
      // deck: [1, 2, 3, 4],
      // priceDeck: [1, 2, 3, 4],
      deck,
      priceDeck,
      players,
      highestBidder: random.Die(ctx.numPlayers) - 1,
      prices: Array(ctx.numPlayers).fill(0),
      sortedSelling: Array(ctx.numPlayers).fill(0),
      ready: Array(ctx.numPlayers).fill(false),
    }
  },

  turn: {
    minMoves: 1,
    maxMoves: 1,
    order: {
      first: ({ G }) => parseInt(G.highestBidder),
      next: ({ G, ctx }) => {
        for (let i = 1; i <= ctx.numPlayers; i++) {
          let nextIndex = (parseInt(ctx.currentPlayer) + i) % ctx.numPlayers
          console.log('checking index:', nextIndex)
          if (!G.players[nextIndex].hasPassed) {
            return nextIndex
          }
        }
      },
    },
  },

  phases: {
    buying: {
      onBegin: ({ G, ctx }) => {
        G.auction = G.deck.splice(0, ctx.numPlayers).sort((a, b) => b - a)
        for (let i = 0; i < ctx.numPlayers; i++) {
          G.players[i].bid = 0
          G.players[i].hasPassed = false
          G.ready = Array(ctx.numPlayers).fill(false)
        }
      },
      start: true,
      moves: { Bid, Pass },
      next: 'readyUp',
    },

    selling: {
      onBegin: ({ G, ctx }) => {
        G.prices = G.priceDeck.splice(0, ctx.numPlayers).sort((a, b) => b - a)
        G.sortedSelling = Array(ctx.numPlayers).fill(0)
        G.selling = Array(ctx.numPlayers).fill(0)
        G.ready = Array(ctx.numPlayers).fill(false)
      },

      turn: {
        stages: {
          playCard: {
            moves: { PickCard },
          },
        },
        minMoves: 1,
        maxMoves: 1,
        activePlayers: { all: 'playCard' },
      },
      next: 'readyUp',
    },

    readyUp: {
      onBegin: ({ G, ctx }) => {
        G.ready = Array(ctx.numPlayers).fill(false)
      },
      turn: {
        stages: {
          ready: {
            moves: { Ready },
          },
        },
        minMoves: 1,
        maxMoves: 1,
        activePlayers: { all: 'ready' },
      },
      next: ({ G }) => {
        return G.deck.length == 0 ? 'selling' : 'buying'
      },
    },
  },

  endIf: ({ G, ctx }) => {
    if (G.prices.length == 0 && G.priceDeck.length == 0) {
      let coinsArr = Array(ctx.numPlayers)
      for (let i = 0; i < ctx.numPlayers; i++) {
        coinsArr[i] = G.players[i].coins
      }
      let mostCoins = Math.max(...coinsArr)
      return { winner: coinsArr.indexOf(mostCoins) }
    }
  },
}

// TODO:
// [X] skip players who passed
// [X] start round robin turn order on winner of last round
// [ ] selling phase
