<template>
  <div class="board">
    <div v-for="i in nRows" class="board-row" :key="'br'+i">
      <Card v-for="(card, idx) in getRowCards(i)" class="board-card" :key="'bc'+idx" :card="card"/>
    </div>
  </div>
</template>

<script>
  import Card from './game/card'

  export default {
    name: 'Board',
    components: { Card },
    props: {
      cards: Array,
    },
    data() {
      return {
        nRows: 0,
        shownCards: 0
      }
    },
    mounted() {
      this.computeRows()
    },
    watch: {
      cards() {
        this.computeRows()
      }
    },
    methods: {
      computeRows() {
        const max = this.cards.length
        let n = 0
        let total = 0

        while (total + n + 1 < max) {
          n++
          total += n
        }

        this.nRows = n
        this.shownCards = total
      },
      getRowCards(rowNum) {
        const startIdx = (rowNum - 1) * rowNum / 2
        const endIdx = startIdx + rowNum
        const cards = []
        for (let i = startIdx; i < endIdx; ++i) {
          cards.push(this.cards[this.shownCards - i - 1])
        }
        return cards
      },
    },
  }
</script>

<style scoped lang="scss">
  .board {
    .board-row {
      text-align: center;
      direction: rtl;
    }

    .board-card {
      display: inline-block;
      width: auto;
      height: 90px;
    }
  }
</style>