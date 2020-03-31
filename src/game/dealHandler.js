export default {
  handleDealPhases(context, data) {
    context.store.commit('addCard', data['card'])
    context.store.commit('addSips', data['sips'])
  }
}
