<template>
  <div class="game">
    <div class="rooms">
      <div v-for="room in rooms" :key="room.id" class="room">
        {{ room.title }}
        <router-link :to="'/room/' + room.id">Rejoindre</router-link>
      </div>
    </div>
    <div class="create-room">
      <form action="">
        <label for="roomName">Nom du salon</label>
        <input id="roomName" type="text" v-model="roomName"/>
        <label for="roomPrivate">Nom du salon</label>
        <input id="roomPrivate" type="checkbox" v-model="roomPrivate"/>
        <button @click.prevent="createRoom">Créer</button>
      </form>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Room',
    data() {
      return {
        rooms: [],
        roomName: null,
        roomPrivate: false,
      }
    },
    sockets: {
      createRoomResponse(res) {
        this.$router.push('/room/' + res.roomId)
      },
      getRoomsResponse(res) {
        this.rooms = res.rooms
      },
    },
    mounted() {
      this.$socket.emit('getRooms')
    },
    methods: {
      createRoom() {
        this.$socket.emit('createRoom', {
          roomName: this.roomName,
          private: this.roomPrivate,
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .cards {
    text-align: left;

    li {
      display: inline-block;
      list-style: none;
    }
  }
</style>