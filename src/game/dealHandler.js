export default {
  handlePhase1(context) {
    context.store.commit('toggleGameComponent', 'deal1')
  },
  handlePhase2(context) {
    context.store.commit('toggleGameComponent', 'deal1')
    context.store.commit('toggleGameComponent', 'deal2')
  },
  handlePhase3(context) {
    context.store.commit('toggleGameComponent', 'deal2')
    context.store.commit('toggleGameComponent', 'deal3')
  },
  handlePhase4(context) {
    context.store.commit('toggleGameComponent', 'deal3')
    context.store.commit('toggleGameComponent', 'deal4')
  },
  handlePhase1To3Response(context, data) {
    context.store.commit('addCard', data['card'])
    context.store.commit('addSips', data['sips'])
  }
}
