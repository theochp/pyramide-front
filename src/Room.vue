<template>
  <div class="game">
    <div class="players">
      <h2>Joueurs</h2>
      <ul class="player-list">
        <li v-for="(player,idx) in players" :key="idx">
          <p class="player-name">
            {{ player.name }}
          </p>
          <div class="player-cards">
            <Card :card="card" v-for="(card,idx) in player.cards" :key="idx" class="player-card"/>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="!room">
      <form action="">
        <label for="usernameInput">Pseudonyme</label>
        <input id="usernameInput" type="text" v-model="user.name" name="username">
        <input type="submit" value="Rejoindre" @click.prevent="joinRoom">
      </form>
    </div>
    <div v-else class="room">
      {{ game.sips }} gorgées
      <button
        v-if="isAdmin && !gameStarted"
        @click="startDeal"
      >
        Démarrer la distribution
      </button>
      <button
        v-if="isAdmin && showStartButton"
        @click="startGame"
      >
        Démarrer le jeu
      </button>
      <deal1 v-if="showDeal[1] && game.cards.length === 0"/>
      <deal2 v-if="showDeal[2] && game.cards.length === 1"/>
      <deal3 v-if="showDeal[3] && game.cards.length === 2"/>
      <deal4 v-if="showDeal[4] && game.cards.length === 3"/>
      <h2>Board</h2>
      <button
        v-if="showNextCardButton"
        @click="showNextCard"
      >
        Prochaine carte
      </button>
      <Board :cards="board" class="board"/>
      <div class="cards">
        <Card :card="game.cards[0]" class="card" @click="onCardClick(0)"/>
        <Card :card="game.cards[1]" class="card" @click="onCardClick(1)"/>
        <Card :card="game.cards[2]" class="card" @click="onCardClick(2)"/>
        <Card :card="game.cards[3]" class="card" @click="onCardClick(3)"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Deal1 from '@/components/game/phases/deal1'
  import Deal2 from '@/components/game/phases/deal2'
  import Deal3 from '@/components/game/phases/deal3'
  import Deal4 from '@/components/game/phases/deal4'
  import Card from '@/components/game/card'
  import Constants from '@/game/constants'
  import Board from '@/components/Board'

  export default {
    name: 'Room',
    components: { Board, Card, Deal1, Deal2, Deal3, Deal4 },
    data() {
      return {
        game: {
          phase: null,
          sips: 0,
          cards: [],
        },
        user: {
          id: null,
          name: null,
        },
        showDeal: {
          1: false,
          2: false,
          3: false,
          4: false,
        },
        room: null,
        roomId: null,
        isAdmin: false,
        gameStarted: false,
        board: [],
        boardPtr: 0,
        remainingCards: 52,
        players: [],
      }
    },
    computed: {
      constants() {
        return Constants
      },
      showNextCardButton() {
        return this.isAdmin && this.gamePhase === Constants.GAME_PHASE_PLAY
      },
      showStartButton() {
        return this.gamePhase === Constants.GAME_PHASE_REMEMBER_CARDS
      },
      gamePhase() {
        return this.game.phase
      },
    },
    sockets: {
      joinRoomResponse(res) {
        if (res.success) {
          this.room = res.room
          this.players = res.players
          this.isAdmin = res.isAdmin
        } else {
          alert(res.message)
        }
      },
      gameUpdate(update) {
        if (update.type === Constants.GAME_UPDATE_GAME_PHASE) {
          this.game.phase = update.payload.gamePhase
        } else if (update.type === Constants.GAME_UPDATE_NEW_CARD) {
          const boardCard = this.board[this.boardPtr]
          boardCard.suit = update.payload.card.suit
          boardCard.value = update.payload.card.value
          boardCard.show = true
          this.boardPtr++
        } else if (update.type === Constants.GAME_UPDATE_REMAINING_CARD) {
          this.remainingCards = update.payload.remainingCards
          this.generateBoard()
        } else if (update.type === Constants.GAME_UPDATE_USER_JOINED) {
          this.players.push(update.user)
        } else if (update.type === Constants.GAME_UPDATE_USER_SHOW_CARD) {
          const player = this.players.find(p => p.id === update.user.id)
          if (player) {
            player.cards[update.cardIdx].suit = update.card.suit
            player.cards[update.cardIdx].value = update.card.value
            this.showCard(player.cards[update.cardIdx], 4)
          }
        } else if (update.type === Constants.GAME_UPDATE_CARD_DEALT) {
          const player = this.players.find(p => p.id === update.payload.user.id)
          if (player) {
            const card = {
              suit: update.payload.card.suit,
              value: update.payload.card.value,
              show: true,
            }
            player.cards.push(card)
          }
        }
      },
      gameActionRequest(data) {
        const request = data['gameRequest']

        if (request === Constants.GAME_REQUEST_DEAL_1) {
          this.showDeal[1] = true
        } else if (request === Constants.GAME_REQUEST_DEAL_2) {
          this.showDeal[2] = true
        } else if (request === Constants.GAME_REQUEST_DEAL_3) {
          this.showDeal[3] = true
        } else if (request === Constants.GAME_REQUEST_DEAL_4) {
          this.showDeal[4] = true
        }

        this.$store.commit('addResponseToken', {
          key: request,
          value: data['responseToken'],
        })
      },
      gameActionResponse(res) {
        const response = res['gameResponse']
        const data = res['data']

        switch (response) {
          case Constants.GAME_RESPONSE_DEAL_1:
          case Constants.GAME_RESPONSE_DEAL_2:
          case Constants.GAME_RESPONSE_DEAL_3:
          case Constants.GAME_RESPONSE_DEAL_4:
            this.game.cards.push(data['card'])
            this.game.sips += data['sips']
            break
        }
      },
    },
    mounted() {
      this.roomId = this.$route.params.id
    },
    methods: {
      startDeal() {
        this.gameStarted = true
        this.$socket.emit('startGame', {
          roomId: this.roomId,
        })
      },
      startGame() {
        this.gameStarted = true
        this.$socket.emit('gameAction', {
          type: Constants.GAME_ACTION_START_PLAY,
        })
      },
      joinRoom() {
        this.$socket.emit('joinRoom', {
          roomId: this.roomId,
          user: {
            name: this.user.name,
          },
          adminToken: this.$store.state.adminToken,
        })
      },
      showNextCard() {
        this.$socket.emit('getNextCard')
      },
      generateBoard() {
        // Generate fake board
        for (let i = 0; i < this.remainingCards; ++i) {
          this.board.push({ suit: Constants.CARD_SUIT_UNKNOWN, value: 0, show: false })
        }
      },
      hideCards() {
        this.game.cards.forEach(card => {
          card.show = false
        })
      },
      onCardClick(cardIdx) {
        this.$socket.emit('showCard', { cardIdx })
        this.showCard(this.game.cards[cardIdx], 3)
      },
      showCard(card, duration) {
        card.show = true
        setTimeout(() => {
          card.show = false
        }, duration * 1000)
      },
    },
    watch: {
      gamePhase(newVal) {
        if (newVal === Constants.GAME_PHASE_PLAY) {
          this.hideCards()
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  #app {
    height: 100%;
  }

  .players {
    position: absolute;
    top: 30px;
    left: 0;
    width: 20%;
    max-width: 250px;
    min-height: 50%;
    background-color: grey;

    .player-list {
      font-weight: bold;
      color: white;
      font-size: 30px;

      li {
        border-top: 2px solid white;
        border-bottom: 2px solid white;
        margin: 10px;
      }

      .player-name {
        margin: 5px;

        &.self {
          font-style: italic;
        }
      }

      .player-cards {
        .player-card {
          width: 25%;
          height: auto;
        }
      }
    }
  }

  .board {
    margin-bottom: 300px;
  }

  .cards {
    $card-width: 130px;
    $card-height: 200px;
    position: fixed;
    right: 10%;
    left: 10%;
    bottom: 0;
    height: 20%;
    padding: 10px 0;

    background-color: #5A250F;

    color: #fff;

    li {
      & + li {
        margin-left: 15px;
      }
    }

    .card {
      width: auto;
      max-width: 25%;
      height: 100%;
    }

    li {
      display: inline-block;
    }
  }

  .board {
    .card {
      width: 100px;
    }
  }
</style>