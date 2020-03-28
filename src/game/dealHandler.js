export default {
  handlePhase1(context) {
    context.store.commit('showGameComponent', 'deal1')
  },
  handlePhase1Response(context, data) {
    context.store.commit('addCard', data['card'])
    context.store.commit('addSips', data['sips'])
  }
}

// if (data['gameRequest'] === 'DEAL_1_RED_OR_BLACK') {
//   let res = window.prompt('Rouge ou noir ?')
//   if (res === 'noir')
//     res = 'DEAL_1_RESPONSE_BLACK'
//   else
//     res = 'DEAL_1_RESPONSE_RED'
//   this.$socket.emit('gameActionResponse', {
//     responseToken: data.responseToken,
//     response: res
//   })
// } else if(data['gameRequest'] === 'DEAL_2_MORE_OR_LESS') {
//   let res = window.prompt('Plus ou moins ?')
//   if (res === 'plus')
//     res = 'DEAL_2_MORE'
//   else
//     res = 'DEAL_2_LESS'
//   this.$socket.emit('gameActionResponse', {
//     responseToken: data.responseToken,
//     response: res
//   })
// } else if(data['gameRequest'] === 'DEAL_3_INTERVAL') {
//   let res = window.prompt('Intérieur ou exterieur ?')
//   if (res === 'interieur')
//     res = 'DEAL_3_INSIDE'
//   else
//     res = 'DEAL_3_OUTSIDE'
//   this.$socket.emit('gameActionResponse', {
//     responseToken: data.responseToken,
//     response: res
//   })
// }