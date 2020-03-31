<template>
  <div class="board">
    <div v-for="i in rows" class="board-row" :key="'br'+i">
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
    computed: {
      rows() {
        const max = this.cards.length
        let n = 0
        let total = 0

        while (total + n + 1 < max) {
          n++
          total += n
        }

        return n
      },
    },
    methods: {
      getRowCards(rowNum) {
        const startIdx = (rowNum - 1) * rowNum / 2
        const endIdx = startIdx + rowNum
        const cards = []
        for (let i = startIdx; i < endIdx; ++i) {
          cards.push(this.cards[i])
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
    }

    .board-card {
      display: inline-block;
      width: auto;
      height: 90px;
    }
  }
</style>