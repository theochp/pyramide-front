<template>
  <div class="phase1">
    <div class="rouge">
      <button
        @click="handleClick(constants.GAME_DEAL_1_RED)"
      >
        Rouge
      </button>
    </div>
    <div class="noir">
      <button
        @click="handleClick(constants.GAME_DEAL_1_BLACK)"
      >
        Noir
      </button>
    </div>
  </div>
</template>

<script>
  import Constants from '@/game/constants'

  export default {
    name: 'deal1',
    data() {
      return {
        constants: Constants,
      }
    },
    computed: {
      responseToken() {
        return this.$store.state.responseTokens.get(Constants.GAME_REQUEST_DEAL_1)
      },
    },
    methods: {
      handleClick(result) {
        this.$store.dispatch('sendGameResponse', {
          responseToken: this.responseToken,
          response: result,
        })
      },
    },
  }
</script>

<style scoped>

</style>