<template>
  <v-btn fab dark large :color="colour" :depressed="status" @click="$emit('click')">{{side}}</v-btn>
</template>

<script>
  export default {
    name: "Breast",
    props: {
      side: {
        type: String,
        required: true,
        validator: function (value) {
          return value === 'L' || value === 'R';
        }
      },
      status: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      colour() {
        return this.side === 'L' ? 'pink': 'teal';
      }
    }
  }
</script>

<style scoped>
  .v-btn--floating.v-btn--large {
    height: 100px;
    width: 100px;
    font-size: xx-large;
    margin: 30px;
  }
</style>
