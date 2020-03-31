<template>
  <div class="phase1">
    <select name="suit" v-model="suit">
      <option v-for="suit in constants.CARD_SUITS" :value="suit" :key="suit">{{ suitName(suit) }}</option>
    </select>
    <button @click="handleClick">Envoyer</button>
  </div>
</template>

<script>
  import Constants from '@/game/constants'

  export default {
    name: 'deal1',
    data() {
      return {
        constants: Constants,
        suit: Constants.CARD_SUITS[0],
      }
    },
    computed: {
      responseToken() {
        return this.$store.state.responseTokens.get(Constants.GAME_REQUEST_DEAL_4)
      },
    },
    methods: {
      handleClick() {
        this.$store.dispatch('sendGameResponse', {
          responseToken: this.responseToken,
          response: this.suit,
        })
      },
      suitName(suit) {
        switch (suit) {
          case Constants.CARD_SUIT_SPADE:
            return 'Pique'
          case Constants.CARD_SUIT_CLUB:
            return 'Trèfle'
          case Constants.CARD_SUIT_HEART:
            return 'Coeur'
          case Constants.CARD_SUIT_DIAMOND:
            return 'Carreau'
          default:
            return ''
        }
      },
    },
  }
</script>

<style scoped>

</style>