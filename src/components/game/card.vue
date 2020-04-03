<template>
  <img :src="imageSrc" :alt="imageName" @click="$emit('click', $event)">
</template>

<script>
  import Constants from '@/game/constants'

  export default {
    name: 'card.vue',
    props: {
      card: {
        required: true,
      },
    },
    computed: {
      imageSrc() {
        return require('@/assets/cards/' + this.imageName + '.png')
      },
      imageName() {
        if (this.card && this.card.show !== false) {
          let suit
          switch (this.card.suit) {
            case Constants.CARD_SUIT_HEART:
              suit = 'H'
              break
            case Constants.CARD_SUIT_DIAMOND:
              suit = 'D'
              break
            case Constants.CARD_SUIT_SPADE:
              suit = 'S'
              break
            case Constants.CARD_SUIT_CLUB:
              suit = 'C'
              break
          }
          if (this.card.value >= 2 && this.card.value <= 10) {
            return this.card.value + suit
          } else {
            switch (this.card.value) {
              case 1:
                return 'A' + suit
              case 11:
                return 'J' + suit
              case 12:
                return 'Q' + suit
              case 13:
                return 'K' + suit
            }
          }
        }

        return 'blue_back'
      },
    },
  }
</script>

<style scoped>

</style>