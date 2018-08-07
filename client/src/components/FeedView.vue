<template>
  <v-card class="main">
    <v-btn fab fixed top right @click="$emit('close')" color="error"><v-icon>close</v-icon></v-btn>
    <div class="display-1">{{title}}</div>
    <breast side="L" @click="side('L')" :outline="!leftSelected"></breast>
    <breast side="R" @click="side('R')" :outline="leftSelected"></breast>
    <v-btn dark large color="orange" @click="editFeed.both = !editFeed.both" :outline="!editFeed.both" class="both mt-3 mb-3">Both</v-btn>

    <v-dialog
        ref="dateDialog"
        v-model="dateDialog"
        :return-value.sync="date"
        persistent
        lazy
        full-width
        width="290px"
    >
      <v-text-field
          slot="activator"
          v-model="date"
          label="Date"
          prepend-icon="event"
          readonly
      ></v-text-field>
      <v-date-picker v-model="date" scrollable color="blue">
        <v-spacer></v-spacer>
        <v-btn flat color="blue" @click="dateDialog = false">Cancel</v-btn>
        <v-btn flat color="blue" @click="$refs.dateDialog.save(date)">OK</v-btn>
      </v-date-picker>
    </v-dialog>

    <v-dialog
        ref="timeDialog"
        v-model="timeDialog"
        :return-value.sync="time"
        persistent
        lazy
        full-width
        width="290px"
    >
      <v-text-field
          slot="activator"
          v-model="time"
          label="Time"
          prepend-icon="access_time"
          readonly
      ></v-text-field>
      <v-time-picker v-if="timeDialog" v-model="time" color="blue" format="24hr">
        <v-spacer></v-spacer>
        <v-btn flat color="blue" @click="timeDialog = false">Cancel</v-btn>
        <v-btn flat color="blue" @click="$refs.timeDialog.save(time)">OK</v-btn>
      </v-time-picker>
    </v-dialog>

    <v-btn color="green" @click="done" large>Done</v-btn>
  </v-card>
</template>

<script>
  import util from '../util';
  export default {
    name: "FeedView",
    props: ['title', 'feed'],
    data() {
      return {
        editFeed: {dateTime: '', first: 'L', both: false},
        date: '',
        time: '12:00',
        dateDialog: false,
        timeDialog: false
      };
    },
    methods: {
      side(side) {
        this.editFeed.first = side;
      },
      done() {
        this.$emit('edit-feed', Object.assign({}, this.editFeed));
      }
    },
    watch: {
      date() {
        this.editFeed.dateTime = this.date + 'T' + this.time;
      },
      time() {
        this.editFeed.dateTime = this.date + 'T' + this.time;
      },
      feed() {
        Object.assign(this.editFeed, this.feed);
        this.editFeed = util.momentise(this.editFeed);
        this.date = this.editFeed.dateTime.format('YYYY-MM-DD');
        this.time = this.editFeed.dateTime.format('HH:mm');
      }
    },
    computed: {
      leftSelected() {
        return this.editFeed.first === 'L';
      }
    },
    created() {
      if (this.feed) {
        Object.assign(this.editFeed, this.feed);
        this.editFeed = util.momentise(this.editFeed);
        this.date = this.editFeed.dateTime.format('YYYY-MM-DD');
        this.time = this.editFeed.dateTime.format('HH:mm');
      } else {
        this.date = this.$moment().format('YYYY-MM-DD');
        this.time = this.$moment().format('HH:mm');
      }
    }
  }
</script>

<style scoped>
  .display-1 {
    padding-top: 25px;
  }
  .main {
    text-align: center;
  }
  .v-dialog__container {
    width: 45vw;
    display: inline-block !important;
  }
  .both {
    display:block;
    margin: 0 auto;
  }
</style>
