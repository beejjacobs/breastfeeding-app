import Vue from 'vue';
import Vuex from 'vuex';
import socket from './socket';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    savedActions: []
  },
  mutations: {
    addAction (state, action) {
      state.savedActions.push(action);
    },
    clearActions(state) {
      state.savedActions = [];
    }
  },
  actions: {
    recall(context) {
      console.log('recall');
      context.state.savedActions.forEach(savedAction => {
        socket.emit(savedAction.action, savedAction.feed, savedAction.newFeed);
      });
      context.commit('clearActions');
      console.log('recall complete, invoking refresh');
      socket.emit('refresh');
    }
  }
});
