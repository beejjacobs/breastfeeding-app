<template>
  <v-btn fab dark :large="large" :small="!large" :color="colour" :depressed="status" @click="$emit('click')" :outline="outline">{{side}}</v-btn>
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
      },
      outline: {
        type: Boolean,
        default: false
      },
      large: {
        type: Boolean,
        default: true
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
  .v-btn--large.v-btn--outline {
    border: 2px solid currentColor;
  }
</style>
