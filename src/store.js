import Constants from '@/game/constants'
import dealHandler from '@/game/dealHandler'

export default {
  state: {
    gamePhase: null,
    responseTokens: new Map(),
    cards: [],
    sips: 0,
    users: [],
    adminToken: null
  },
  actions: {
    handleGameRequest(context, requestData) {
      const request = requestData['gameRequest']

      // const commonGameData = {
      //   socket: this._vm.$socket,
      //   store: this,
      // }
      this.commit('addResponseToken', {
        key: request,
        value: requestData['responseToken'],
      })
      // switch (request) {
      //   case Constants.GAME_REQUEST_DEAL_1:
      //     dealHandler.handlePhase1(commonGameData)
      //     break
      //   case Constants.GAME_REQUEST_DEAL_2:
      //     dealHandler.handlePhase2(commonGameData)
      //     break
      //   case Constants.GAME_REQUEST_DEAL_3:
      //     dealHandler.handlePhase3(commonGameData)
      //     break
      //   case Constants.GAME_REQUEST_DEAL_4:
      //     dealHandler.handlePhase4(commonGameData)
      //     break
      // }
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
        case Constants.GAME_RESPONSE_DEAL_4:
          dealHandler.handleDealPhases(commonGameData, data)
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
    },
    updateGamePhase(state, phase) {
      state.gamePhase = phase
    },
    setAdminToken(state, token) {
      state.adminToken = token
    },
    showCards(state) {
      state.cards[0].show = false
      state.cards.forEach(card => {
        card.show = false
      })
    }
  },
}