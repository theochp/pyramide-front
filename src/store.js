import Constants from '@/game/constants'
import dealHandler from '@/game/dealHandler'

export default {
  state: {
    gameComponentDisplay: {
      deal1: false,
      deal2: false,
      deal3: false,
      deal4: false,
    },
    responseTokens: new Map(),
    cards: [],
    sips: 0,
    users: []
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
          break
        case Constants.GAME_REQUEST_DEAL_2:
          dealHandler.handlePhase2(commonGameData)
          break
        case Constants.GAME_REQUEST_DEAL_3:
          dealHandler.handlePhase3(commonGameData)
          break
        case Constants.GAME_REQUEST_DEAL_4:
          dealHandler.handlePhase4(commonGameData)
          break
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
        case Constants.GAME_RESPONSE_DEAL_2:
        case Constants.GAME_RESPONSE_DEAL_3:
        case Constants.GAME_RESPONSE_DEAL_4: // TODO: different thing for 4 (start next round)
          dealHandler.handlePhase1To3Response(commonGameData, data)
          break
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
    toggleGameComponent(state, componentName) {
      if (state.gameComponentDisplay[componentName] !== undefined) {
        state.gameComponentDisplay[componentName] = !state.gameComponentDisplay[componentName]
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
    addUser(state, user) {
      state.users.push(user)
    }
  },
}