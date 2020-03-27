<template>
  <div class="room">
    Test
    <button
      v-if="isAdmin"
      @click="startGame"
    >
      Démarrer la partie
    </button>
  </div>
</template>

<script>
  export default {
    name: 'Room',
    data() {
      return {
        room: null,
        roomId: null,
        joiningRoom: false,
        isAdmin: true
      }
    },
    sockets: {
      joinRoomResponse(res) {
        if(res.success)  {
          this.room = res.room
          this.joiningRoom = false
        } else {
          alert(res.message)
        }
      },
      gameUpdate() {

      },
      gameActionRequest(data) {
        let res = window.prompt('Rouge ou noir ?')
        if (res === 'noir')
          res = 'DEAL_1_RESPONSE_BLACK'
        else
          res = 'DEAL_1_RESPONSE_RED'
        this.$socket.emit('gameActionResponse', {
          responseToken: data.responseToken,
          response: res
        })
      },
      gameActionResponse(response) {
        console.log(response)
      }
    },
    mounted() {
      this.roomId = this.$route.params.id
      this.$socket.emit('joinRoom', {
        roomId: this.roomId,
        user: {
          name: 'theo'
        }
      })
      this.joiningRoom = true
    },
    methods: {
      startGame() {
        this.$socket.emit('startGame', {
          roomId: this.roomId
        })
      }
    }
  }
</script>

<style scoped>

</style>