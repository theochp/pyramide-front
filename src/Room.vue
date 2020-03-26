<template>
  <div class="room">
    Test
  </div>
</template>

<script>
  export default {
    name: 'Room',
    data() {
      return {
        joiningRoom: false,
        room: null
      }
    },
    sockets: {
      joinRoomResponse(res) {
        if(res.success)  {
          this.room = res.room
          this.joiningRoom = false
        }
      }
    },
    mounted() {
      const roomId = this.$route.params.id
      this.$socket.emit('joinRoom', {
        roomId,
        user: {
          name: 'theo'
        }
      })
      this.joiningRoom = true
    }
  }
</script>

<style scoped>

</style>