import Vue from 'vue';

export default {
  fromNow(date) {
    return Vue.moment.duration(date.diff(Vue.moment()));
  },
  hoursMinutes(duration) {
    let mins = Math.abs(duration.minutes());
    let hours = Math.abs(duration.hours());
    let s = '';
    if (hours !== 0) {
      s += `${hours} hour`;
      if (hours > 1) {
        s += 's';
      }
      s += ' ';
    }
    if (mins !== 0) {
      s += `${mins} minute`;
      if (mins > 1) {
        s += 's';
      }
    }

    return s;
  },
  dateToHoursMinutes(date) {
    return this.hoursMinutes(this.fromNow(date));
  },
  momentise(feed) {
    feed.dateTime = Vue.moment(feed.dateTime);
    return feed;
  },
  insertIndex(feeds, feed) {
    return feeds.findIndex(f => {
      return f.dateTime.diff(feed.dateTime) > 0;
    });
  },
  isToday(feed) {
    return feed.dateTime.isSame(Vue.moment(), 'day');
  }
};
