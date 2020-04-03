export default {
  state: {
    adminToken: null,
    responseTokens: new Map(),
  },
  mutations: {
    setAdminToken(state, token) {
      state.adminToken = token
    },
    addResponseToken(state, { key, value }) {
      state.responseTokens.set(key, value)
    },
  },
  actions: {
    handleGameRequest(context, requestData) {
      const request = requestData['gameRequest']

      this.commit('addResponseToken', {
        key: request,
        value: requestData['responseToken'],
      })
    },
    sendGameResponse(context, data) {
      this._vm.$socket.emit('gameActionResponse', {
        responseToken: data.responseToken,
        response: data.response,
      })
    },
  },
}