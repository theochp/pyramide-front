import Constants from '@/game/constants'
import dealHandler from '@/game/dealHandler'

export default {
  state: {
    gameComponentDisplay: {
      deal1: false,
    },
    responseTokens: new Map(),
    cards: [],
    sips: 0,
  },
  actions: {
    handleGameRequest(context, requestData) {
      const request = requestData['gameRequest']

      const commonGameData = {
        socket: this._vm.$socket,
        store: this,
      }
      this.commit('addResponseToken', {
        key: request,
        value: requestData['responseToken'],
      })
      switch (request) {
        case Constants.GAME_REQUEST_DEAL_1:
          dealHandler.handlePhase1(commonGameData)
      }
    },
    handleGameResponse(context, responseData) {
      const response = responseData['gameResponse']
      const data = responseData['data']

      const commonGameData = {
        socket: this._vm.$socket,
        store: this,
      }

      switch (response) {
        case Constants.GAME_RESPONSE_DEAL_1:
          dealHandler.handlePhase1Response(commonGameData, data)
      }
    },
    sendGameResponse(context, data) {
      this._vm.$socket.emit('gameActionResponse', {
        responseToken: data.responseToken,
        response: data.response,
      })
    },
  },
  mutations: {
    showGameComponent(state, componentName) {
      if (state.gameComponentDisplay[componentName] !== undefined) {
        state.gameComponentDisplay[componentName] = true
        console.log('updated')
      }
    },
    addResponseToken(state, { key, value }) {
      state.responseTokens.set(key, value)
    },
    addCard(state, card) {
      state.cards.push(card)
    },
    addSips(state, sips) {
      state.sips += sips
    },
  },
}