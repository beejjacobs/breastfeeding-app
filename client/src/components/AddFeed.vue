<template>
  <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="show">
    <v-btn slot="activator" fab fixed bottom right color="green darken-2"><v-icon>add</v-icon></v-btn>
    <v-card class="main">
      <v-btn fab fixed top right @click="show = false" color="error"><v-icon>close</v-icon></v-btn>
      <div class="display-1">Add a Feed</div>
      <breast side="L" @click="side('L')" :outline="!leftSelected"></breast>
      <breast side="R" @click="side('R')" :outline="leftSelected"></breast>
      <v-btn dark large color="orange" @click="feed.both = !feed.both" :outline="!feed.both" class="both mt-3 mb-3">Both</v-btn>

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

      <v-btn color="green" @click="add" large>Add</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "AddFeed",
    data() {
      return {
        show: false,
        feed: {dateTime: '', first: 'L', both: false},
        date: '',
        time: '12:00',
        dateDialog: false,
        timeDialog: false
      };
    },
    methods: {
      side(side) {
        console.log(side);
        this.feed.first = side;
      },
      add() {
        this.$emit('new-feed', this.feed);
        this.show = false;
      }
    },
    watch: {
      date(value) {
        this.feed.dateTime = this.date + 'T' + this.time;
      },
      time(value) {
        this.feed.dateTime = this.date + 'T' + this.time;
      }
    },
    computed: {
      leftSelected() {
        return this.feed.first === 'L';
      }
    },
    created() {
      this.date = this.$moment().format('YYYY-MM-DD');
      this.time = this.$moment().format('HH:mm');
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
