<template>
  <div class="room">
    {{ sips }} gorgées
    Cartes:
    <ul>
      <li v-for="card in cards" :key="card.suit+card.value">
        {{ card.value}} + {{ card.suit }}
      </li>
    </ul>
    <button
      v-if="isAdmin && !gameStarted"
      @click="startGame"
    >
      Démarrer la partie
    </button>
    <deal1 v-if="gameComponentDisplay.deal1"/>
    <deal2 v-if="gameComponentDisplay.deal2"/>
    <deal3 v-if="gameComponentDisplay.deal3"/>
    <deal4 v-if="gameComponentDisplay.deal4"/>
  </div>
</template>

<script>
  import Deal1 from '@/components/game/phases/deal1'
  import Deal2 from '@/components/game/phases/deal2'
  import Deal3 from '@/components/game/phases/deal3'
  import Deal4 from '@/components/game/phases/deal4'

  export default {
    name: 'Room',
    components: { Deal1, Deal2, Deal3, Deal4 },
    data() {
      return {
        room: null,
        roomId: null,
        joiningRoom: false,
        isAdmin: true,
        gameStarted: false,
      }
    },
    computed: {
      gameComponentDisplay() {
        return this.$store.state.gameComponentDisplay
      },
      sips() {
        return this.$store.state.sips
      },
      cards() {
        return this.$store.state.cards
      },
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
      gameUpdate() {

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
      this.$socket.emit('joinRoom', {
        roomId: this.roomId,
        user: {
          name: 'theo',
        },
      })
      this.joiningRoom = true
    },
    methods: {
      startGame() {
        this.gameStarted = true
        this.$socket.emit('startGame', {
          roomId: this.roomId,
        })
      },
    },
  }
</script>

<style scoped>

</style>