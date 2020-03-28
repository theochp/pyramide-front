<template>
  <div class="phase2">
    <div class="rouge">
      <button
        @click="handleClick(constants.GAME_DEAL_2_MORE)"
      >
        Plus
      </button>
    </div>
    <div class="noir">
      <button
        @click="handleClick(constants.GAME_DEAL_2_LESS)"
      >
        Moins
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
        return this.$store.state.responseTokens.get(Constants.GAME_REQUEST_DEAL_2)
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