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
      v-if="isAdmin"
      @click="startGame"
    >
      Démarrer la partie
    </button>
    <deal1 v-if="gameComponentDisplay.deal1"/>
  </div>
</template>

<script>
  import Deal1 from '@/components/game/phases/deal1'

  export default {
    name: 'Room',
    components: { Deal1 },
    data() {
      return {
        room: null,
        roomId: null,
        joiningRoom: false,
        isAdmin: true,
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
      console.log(this.gameComponentDisplay)
    },
    methods: {
      startGame() {
        this.$socket.emit('startGame', {
          roomId: this.roomId,
        })
      },
    },
  }
</script>

<style scoped>

</style>