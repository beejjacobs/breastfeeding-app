<template>
  <v-app dark>
    <v-content>
      <v-layout align-center justify-center class="section">
        <last-feed v-if="feeds.length !== 0" :last-feed="lastFeed" :feed-count="todaysFeeds.length" @both="both"></last-feed>
        <history v-if="feeds.length !== 0" :todays-feeds="todaysFeeds" :yesterdays-feeds="yesterdaysFeeds" @delete-feed="deleteFeed" @edit-feed="editFeed"></history>
        <v-flex v-else-if="loading">
          <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
          ></v-progress-circular>
        </v-flex>
        <v-flex v-else>
          <div class="display-1 ma-1">No Feeds Today</div>
        </v-flex>
      </v-layout>
      <v-layout align-center class="section">
        <start-feed @start-feed="startFeed"></start-feed>
      </v-layout>
      <add-feed @new-feed="newFeed"></add-feed>
      <status :connected="connected" :last-connected-at="lastConnected" :saved-actions-count="savedActionsCount"/>
    </v-content>
  </v-app>
</template>

<script>
  import {mapGetters, mapState} from 'vuex';

  export default {
    data() {
      return {
        addDialog: false,
        historyDialog: false
      }
    },
    methods: {
      startFeed(side) {
        this.$store.dispatch('startFeed', side);
      },
      both() {
        this.$store.dispatch('updateLastFeedBoth');
      },
      newFeed(feed) {
        this.$store.dispatch('newFeed', feed);
      },
      editFeed(feed, newFeed) {
        this.$store.dispatch('editFeed', {feed, newFeed});
      },
      deleteFeed(feed) {
        this.$store.dispatch('deleteFeed', feed);
      }
    },
    computed: {
      ...mapGetters([
        'feeds',
        'lastFeed',
        'todaysFeeds',
        'yesterdaysFeeds',
        'savedActionsCount'
      ]),
      ...mapState({
        connected: state => state.connected,
        lastConnected: state => state.lastConnected,
        loading: state => state.loading
      })
    },
    created() {
      setTimeout(() => {
        this.$store.commit('setLoading', false);
      }, 5000);
    }
  }
</script>

<style>
  .application.theme--dark {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: black;
    color: #d8d8d8;
  }
  .theme--dark .v-card {
    background: black;
  }

  .display-1 {
    color: rgba(216, 216, 216, 0.5);
  }

  .section {
    height: 50vh;
    justify-items: center;
    text-align: center;
  }
</style>
