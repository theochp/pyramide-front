<template>
  <div class="game">
    <div v-if="!room">
      <form action="">
        <label for="usernameInput">Pseudonyme</label>
        <input id="usernameInput" type="text" v-model="username" name="username">
        <input type="submit" value="Rejoindre" @click.prevent="joinRoom">
      </form>
    </div>
    <div v-else class="room">
      <img src="@/assets/cards/back_cards-07.png" alt="back cards" width="300" height="auto">
      {{ sips }} gorgées
      Cartes:
      <ul class="cards">
        <li v-for="card in cards" :key="card.suit+card.value">
          <Card :card="card" class="card"/>
        </li>
      </ul>
      <button
        v-if="isAdmin && !gameStarted"
        @click="startGame"
      >
        Démarrer la partie
      </button>
      <deal1 v-if="gamePhase === constants.GAME_PHASE_DEAL_1"/>
      <deal2 v-if="gamePhase === constants.GAME_PHASE_DEAL_2"/>
      <deal3 v-if="gamePhase === constants.GAME_PHASE_DEAL_3"/>
      <deal4 v-if="gamePhase === constants.GAME_PHASE_DEAL_4"/>
      <h2>Board</h2>
      <div class="board">
        <Card v-for="card in board" :card="card" :key="card.value+card.suit" class="card"/>
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

  export default {
    name: 'Room',
    components: { Card, Deal1, Deal2, Deal3, Deal4 },
    data() {
      return {
        room: null,
        roomId: null,
        joiningRoom: false,
        isAdmin: true,
        gameStarted: false,
        username: null,
        board: []
      }
    },
    computed: {
      gamePhase() {
        return this.$store.state.gamePhase
      },
      sips() {
        return this.$store.state.sips
      },
      cards() {
        return this.$store.state.cards
      },
      constants() {
        return Constants
      }
    },
    sockets: {
      joinRoomResponse(res) {
        if (res.success) {
          this.room = res.room
          this.joiningRoom = false
        } else {
          alert(res.message)
        }
      },
      userJoined(data) {
        this.$store.commit('addUser', data.user)
      },
      gameUpdate(data) {
        if (data.type === Constants.GAME_UPDATE_GAME_PHASE) {
          this.$store.commit('updateGamePhase', data.payload.gamePhase)
        } else if (data.type === Constants.GAME_UPDATE_NEW_CARD) {
          this.board.push(data.payload.card)
        }
      },
      gameActionRequest(data) {
        this.$store.dispatch('handleGameRequest', data)
      },
      gameActionResponse(data) {
        this.$store.dispatch('handleGameResponse', data)
      },
    },
    mounted() {
      this.roomId = this.$route.params.id
    },
    methods: {
      startGame() {
        this.gameStarted = true
        this.$socket.emit('startGame', {
          roomId: this.roomId,
        })
      },
      joinRoom() {
        this.$socket.emit('joinRoom', {
          roomId: this.roomId,
          user: {
            name: this.username,
          },
        })
        this.joiningRoom = true
      },
    },
    watch: {
      gamePhase(newVal) {
        if (newVal === Constants.GAME_PHASE_REMEMBER_CARDS) {
          alert('Remember your cards! ' + Constants.SECONDS_TO_REMEMBER +  ' seconds.')
        } else if (newVal === Constants.GAME_PHASE_PLAY) {
          console.log('play started')
        }
      }
    }
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