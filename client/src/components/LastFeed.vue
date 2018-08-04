<template>
  <v-flex>
    <v-btn fab fixed top left color="blue darken-3" outline><span class="white--text headline">{{feeds.length}}</span></v-btn>
    <div class="display-1">Last Feed</div>
    <div class="status mt-1 mb-1">
      <breast :side="lastFeed.first" status></breast>
      <breast v-if="lastFeed.both" :side="lastFeed.first === 'L' ? 'R' : 'L'" status></breast>
    </div>
    <table class="title mt-1 mb-1">
      <tr>
        <td>Started</td>
        <td>{{lastFeed.dateTime | moment('HH:mm')}}</td>
        <td>{{timeSinceFeed}}</td>
      </tr>
      <tr>
        <td>Next</td>
        <td>{{lastFeed.next | moment('HH:mm')}}</td>
        <td>{{timeToFeed}}</td>
      </tr>
    </table>
    <v-btn v-if="!lastFeed.both" dark large color="orange" @click="both">Both</v-btn>
    <div v-else class="spacer"></div>
    <history :feeds="feeds"></history>
  </v-flex>
</template>

<script>
  import util from '../util';
  export default {
    name: "LastFeed",
    props: ['lastFeed', 'feeds'],
    data() {
      return {
        timeToFeed: '',
        timeSinceFeed: ''
      }
    },
    methods: {
      updateTimes() {
        if (this.lastFeed.hasOwnProperty('next')) {
          this.timeToFeed = util.dateToHoursMinutes(this.lastFeed.next);
        }
        if (this.lastFeed.hasOwnProperty('dateTime')) {
          this.timeSinceFeed = util.dateToHoursMinutes(this.lastFeed.dateTime);
        }
      },
      both() {
        this.$emit('both');
      }
    },
    watch: {
      lastFeed(value) {
        this.updateTimes();
      }
    },
    created() {

      this.updateTimes();
      setInterval(() => {
        this.updateTimes();
      }, 60 * 1000);
    }
  }
</script>

<style scoped>
  .display-1 {
    margin-top: 40px;
  }
  .spacer {
    height: 35px;
  }

  .status {
    text-align: left;
    width: 324px;
    margin: 0 auto;
  }

  table.title {
    text-align: left;
    margin: 0 auto;
  }

  table.title td {
    padding: 10px;
  }

  table.title td:first-child {
    text-align: right;
  }
</style>
