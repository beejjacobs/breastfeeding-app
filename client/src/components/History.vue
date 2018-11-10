<template>
  <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="show">
    <v-btn slot="activator" fab fixed top right color="blue darken-3">
      <v-icon>history</v-icon>
    </v-btn>
    <v-card class="main">
      <v-btn fab fixed top left color="white" outline><span class="white--text headline">{{feeds.length}}</span></v-btn>
      <v-btn fab fixed top right @click="show = false" color="error">
        <v-icon>close</v-icon>
      </v-btn>
      <div class="display-1">{{today ? 'Today' : 'Yesterday'}}'s Feeds</div>
      <table>
        <tr>
          <td>
            <v-btn fab small color="blue darken-2" @click="today = !today">
              <v-icon v-if="today">arrow_back</v-icon>
              <v-icon v-else>arrow_forward</v-icon>
            </v-btn>
          </td>
          <td>
            Time<br/>
            <span class="average">Avg: {{averageGap}}</span>
          </td>
          <td>
            <v-btn fab dark small depressed color="pink">{{counts.l}}</v-btn>
            <v-btn fab dark small depressed color="teal">{{counts.r}}</v-btn>
          </td>
        </tr>
        <tr v-for="(feed, i) in feeds" :key="i">
          <td>
            <v-speed-dial direction="right" v-model="menus[i]">
              <v-btn slot="activator" color="blue darken-2" v-model="menus[i]" dark fab small><v-icon>settings</v-icon><v-icon>close</v-icon></v-btn>
              <v-btn fab dark small color="green" @click="edit(feed)"><v-icon>edit</v-icon></v-btn>
              <v-btn fab dark small color="red darken-3" @click="$emit('delete-feed', feed)"><v-icon>delete</v-icon></v-btn>
            </v-speed-dial>
          </td>
          <td :class="{hide: menus[i]}">{{feed.dateTime.format('HH:mm')}}</td>
          <td>
            <breast :side="feed.first" status :large="false"></breast>
            <breast v-if="feed.both" :side="feed.first === 'L' ? 'R' : 'L'" status :large="false"></breast>
          </td>
        </tr>
      </table>
    </v-card>
    <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="showEdit">
      <feed-view title="Edit a Feed" @close="showEdit = false" :feed="editFeed" @edit-feed="commitEdit"></feed-view>
    </v-dialog>
  </v-dialog>
</template>

<script>
  export default {
    name: "History",
    props: ['todays-feeds', 'yesterdays-feeds'],
    data() {
      return {
        show: false,
        showEdit: false,
        editFeed: {},
        menus: [],
        today: true
      };
    },
    computed: {
      averageGap() {
        let times = this.feeds.map(feed => feed.dateTime);
        if (this.today && this.yesterdaysFeeds.length > 0) {
          times.unshift(this.yesterdaysFeeds[this.yesterdaysFeeds.length-1].dateTime);
        }
        if (times.length < 2) {
          return '0:00';
        }
        let total = 0;
        for (let i = 1; i < times.length; i++) {
          total += this.$moment.duration(times[i].diff(times[i-1]));
        }
        let average = this.$moment.duration(total / (times.length-1));
        return average.hours() + ':' + (average.minutes() < 10 ? '0' : '') + average.minutes();
      },
      feeds() {
        if (this.today) {
          return this.todaysFeeds || [];
        }
        return this.yesterdaysFeeds || [];
      },
      counts() {
        let l = 0;
        let r = 0;
        for (let feed of this.feeds) {
          if (feed.both) {
            l++;
            r++;
          } else if (feed.first === 'L') {
            l++;
          } else {
            r++;
          }
        }
        return {l, r};
      }
    },
    watch: {
      feeds() {
        this.menus.length = this.feeds.length;
      }
    },
    methods: {
      edit(feed) {
        this.editFeed = feed;
        this.showEdit = true;
      },
      commitEdit(feed) {
        this.$emit('edit-feed', this.editFeed, feed);
        this.showEdit = false;
      }
    }
  }
</script>

<style scoped>
  .main {
    text-align: center;
  }
  .display-1 {
    padding-top: 25px;
    margin-bottom: 20px;
  }

  table {
    font-size: large;
    margin: 0 auto;
    min-width: 50vw;
    border-collapse: collapse;
    border-style: hidden;
  }

  td:last-child {
    text-align: left;
  }
  td:nth-child(2) {
    min-width: 128px;
  }

  table td, table th {
    border: 1px solid rgba(216, 216, 216, 0.5);
    padding: 5px;
    transition: 0.5s;
  }

  .hide {
    color: black;;
  }
</style>
