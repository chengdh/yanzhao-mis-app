const state = {
  userName: '',
  waittingOperates: 0,
  unreadMessages: 0
}
const mutations = {
  SET_USER_NAME(state, name) {
    state.userName = name
  },
  SET_WAITTING_OPERATES(state, count) {
    state.waittingOperates = count
  },
  SET_UNREAD_MESSAGES(state, count) {
    state.unreadMessages = count
  }
}
const actions = {
  // 设置name
  setUserName({ commit }, name) {
    commit('SET_USER_NAME', name)
  },
  setWaittingOperates({ commit }, count) {
    commit('SET_WAITTING_OPERATES', count)
  },
  setUnreadMessages({ commit }, count) {
    commit('SET_UNREAD_MESSAGES', count)
  }
}
export default {
  state,
  mutations,
  actions
}
