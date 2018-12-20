import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import {socket, SocketStorePlugin} from './socket';
import createPersistedState from 'vuex-persistedstate';
import util from './util';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connected: false,
    loading: false,
    feeds: [],
    savedActions: []
  },
  getters: {
    lastFeed(state) {
      if (state.feeds.length === 0) {
        return {};
      }
      let feed = state.feeds[state.feeds.length - 1];
      feed.next = feed.dateTime.clone().add(2, 'hours');
      return feed;
    },
    todaysFeeds(state) {
      return state.feeds.filter(util.isToday);
    },
    yesterdaysFeeds(state) {
      return state.feeds.filter(util.isYesterday);
    }
  },
  mutations: {
    setConnected(state, connected) {
      state.connected = connected;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    addAction (state, action) {
      state.savedActions.push(action);
    },
    clearActions(state) {
      state.savedActions = [];
    },
    setFeeds(state, feeds) {
      state.feeds = feeds;
    },
    addFeed(state, feed) {
      state.feeds.push(feed);
    },
    addOrInsertFeed(state, feed) {
      let index = util.insertIndex(state.feeds, feed);
      if (index === -1) {
        state.feeds.push(feed);
      } else {
        state.feeds.splice(index, 0, feed);
      }
    },
    updateLastFeedBoth(state) {
      if (state.feeds.length === 0) {
        return;
      }
      let feed = state.feeds[state.feeds.length - 1];
      feed.both = true;
    },
    updateLastFeed(state, feed) {
      Vue.set(state.feeds, state.feeds.length - 1, feed);
    },
    editFeed(state, {feed, newFeed}) {
      let index = state.feeds.findIndex(value => util.match(feed, value));
      if (index !== -1) {
        state.feeds.splice(index, 1, newFeed);
      } else {
        console.log('feed not found');
      }
    },
    deleteFeed(state, feed) {
      let index = state.feeds.findIndex(value => util.match(feed, value));
      if (index !== -1) {
        state.feeds.splice(index, 1);
      } else {
        console.log('feed not found');
      }
    }
  },
  actions: {
    startFeed(context, side) {
      let feed = {dateTime: moment(), first: side, both: false};
      context.commit('addFeed', feed);
      context.dispatch('action', {action: 'feed', feed});
    },
    updateLastFeedBoth(context) {
      context.commit('updateLastFeedBoth');
      context.dispatch('action', {action: 'feed-update', feed: context.getters.lastFeed});
    },
    newFeed(context, feed) {
      feed = util.momentise(feed);
      context.dispatch('action', {action: 'add-feed', feed});
      context.commit('addOrInsertFeed', feed);
    },
    editFeed(context, {feed, newFeed}) {
      newFeed = util.momentise(newFeed);
      context.dispatch('action', {action: 'edit-feed', feed, newFeed});
      context.commit('editFeed', {feed, newFeed});
    },
    deleteFeed(context, feed) {
      context.dispatch('action', {action: 'delete-feed', feed});
      context.commit('deleteFeed', feed);
    },
    recall(context) {
      console.log('recall');
      context.state.savedActions.forEach(savedAction => {
        socket.emit(savedAction.action, savedAction.feed, savedAction.newFeed);
      });
      context.commit('clearActions');
      console.log('recall complete, invoking refresh');
      socket.emit('refresh');
    },
    action(context, {action, feed, newFeed}) {
      if (context.state.connected) {
        socket.emit(action, feed, newFeed);
      } else {
        let feedCopy = {dateTime: feed.dateTime.format(), first: feed.first, both: feed.both};
        let newFeedCopy = {};
        if (newFeed) {
          newFeedCopy = {dateTime: newFeed.dateTime.format(), first: newFeed.first, both: newFeed.both};
        }
        context.commit('addAction', {action: action, feed: feedCopy, newFeed: newFeedCopy});
      }
    }
  },
  plugins: [
    createPersistedState({
      paths: [
        'feeds',
        'savedActions'
      ]
    }),
    SocketStorePlugin
  ]
});
