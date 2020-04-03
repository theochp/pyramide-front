<template>
  <div class="game">
    <div class="players">
      <ul>
        <li>{{ username }}</li>
        <li v-for="(player,idx) in players" :key="idx">{{ player.name }}</li>
      </ul>
    </div>
    <div v-if="!room">
      <form action="">
        <label for="usernameInput">Pseudonyme</label>
        <input id="usernameInput" type="text" v-model="username" name="username">
        <input type="submit" value="Rejoindre" @click.prevent="joinRoom">
      </form>
    </div>
    <div v-else class="room">
      <img src="@/assets/cards/back_cards-07.png" alt="back cards" width="300" height="auto">
      {{ game.sips }} gorgées
      Cartes:
      <ul class="cards">
        <li v-for="(card, index) in game.cards" :key="index">
          <Card :card="card" class="card" @click="onCardClick(index)"/>
        </li>
      </ul>
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
      <deal1 v-if="game.phase === constants.GAME_PHASE_DEAL_1"/>
      <deal2 v-if="game.phase === constants.GAME_PHASE_DEAL_2"/>
      <deal3 v-if="game.phase === constants.GAME_PHASE_DEAL_3"/>
      <deal4 v-if="game.phase === constants.GAME_PHASE_DEAL_4"/>
      <h2>Board</h2>
      <button
        v-if="showNextCardButton"
        @click="showNextCard"
      >
        Prochaine carte
      </button>
      <Board :cards="board"/>
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
        room: null,
        roomId: null,
        isAdmin: false,
        gameStarted: false,
        username: null,
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
          this.isAdmin = res.isAdmin
        } else {
          alert(res.message)
        }
      },
      gameUpdate(data) {
        if (data.type === Constants.GAME_UPDATE_GAME_PHASE) {
          this.game.phase = data.payload.gamePhase
        } else if (data.type === Constants.GAME_UPDATE_NEW_CARD) {
          const boardCard = this.board[this.boardPtr]
          boardCard.suit = data.payload.card.suit
          boardCard.value = data.payload.card.value
          boardCard.show = true
          this.boardPtr++
        } else if (data.type === Constants.GAME_UPDATE_REMAINING_CARD) {
          this.remainingCards = data.payload.remainingCards
          this.generateBoard()
        } else if (data.type === Constants.GAME_UPDATE_USER_JOINED) {
          // TODO: refactor
          data.user.cards.push({ suit: Constants.CARD_SUIT_UNKNOWN, value: 0 })
          data.user.cards.push({ suit: Constants.CARD_SUIT_UNKNOWN, value: 0 })
          data.user.cards.push({ suit: Constants.CARD_SUIT_UNKNOWN, value: 0 })
          data.user.cards.push({ suit: Constants.CARD_SUIT_UNKNOWN, value: 0 })
          this.players.push(data.user)
        } else if (data.type === Constants.GAME_UPDATE_USER_SHOW_CARD) {
          const player = this.players.find(p => p.name === data.user.name) // TODO: use user id

          player.cards[data.cardIdx].suit = data.card.suit
          player.cards[data.cardIdx].value = data.card.value
          this.showCard(player.cards[data.cardIdx], 4)
        }
      },
      gameActionRequest(data) {
        this.$store.dispatch('handleGameRequest', data)
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
            name: this.username,
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
          this.board.push({ suit: Constants.CARD_SUIT_CLUB, value: 1, show: false })
        }
      },
      hideCards() {
        this.game.cards.forEach(card => {
          card.show = false
        })
      },
      onCardClick(cardIdx) {
        this.$socket.emit('showCard', { cardIdx })
        this.showCard(this.cards[cardIdx], 3)
      },
      showCard(card, duration) {
        card.show = true
        setTimeout(() => card.show = false, duration * 1000)
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
  .cards {
    min-height: 200px;
    text-align: left;

    .card {
      width: auto;
      height: 200px;
    }

    li {
      display: inline-block;
      list-style: none;
    }
  }

  .board {
    .card {
      width: 100px;
    }
  }
</style>