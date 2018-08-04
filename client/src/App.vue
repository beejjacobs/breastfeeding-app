<template>
  <v-app dark>
    <v-content>
      <v-layout align-center justify-center class="section">
        <last-feed v-if="feeds.length !== 0" :last-feed="lastFeed"></last-feed>
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
      <add-feed></add-feed>
    </v-content>
  </v-app>
</template>

<script>
  import io from 'socket.io-client';
  import util from './util';
  const url = process.env.NODE_ENV === 'production' ? '192.162.0.2' : 'localhost';
  const socket = io.connect(`http://${url}:3002`);

  export default {
    data() {
      return {
        feeds: [],
        loading: true,
        addDialog: false,
        historyDialog: false
      }
    },
    methods: {
      startFeed(side) {
        let feed = {dateTime: this.$moment(), first: side, both: false};
        socket.emit('feed', feed);
        this.feeds.push(feed);
      },
      both() {
        this.lastFeed.both = true;
        socket.emit('feed-update', this.lastFeed);
      }
    },
    computed: {
      lastFeed() {
        if (this.feeds.length === 0) {
          return {};
        }
        let feed = this.feeds[this.feeds.length - 1];
        feed.next = feed.dateTime.clone().add(2, 'hours');
        return feed;
      }
    },
    created() {
      socket.on('feed', feed => {
        console.log(feed);
        this.feeds.push(util.momentise(feed));
      });
      socket.on('feed-update', feed => {
        console.log(feed);
        this.$set(this.feeds, this.feeds.length - 1, util.momentise(feed));
      });
      socket.on('todays-feeds', feeds => {
        this.loading = false;
        console.log(feeds);
        this.feeds = feeds.map(util.momentise);
      });
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

  .display-1 {
    color: rgba(216, 216, 216, 0.5);
  }

  .section {
    height: 50vh;
    justify-items: center;
    text-align: center;
  }
</style>
