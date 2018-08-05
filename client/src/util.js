import Vue from 'vue';

export default {
  fromNow(date) {
    return Vue.moment.duration(date.diff(Vue.moment()));
  },
  hoursMinutes(duration) {
    let past = duration < 0;
    let secs = Math.abs(duration.seconds());
    let mins = Math.abs(duration.minutes()) + (secs > 30 ? 1 : 0);
    let hours = Math.abs(duration.hours());
    let hasValue = mins !== 0 || hours !== 0;
    if (!hasValue) {
      return '';
    }
    if (mins === 60) {
      mins = 0;
      hours++;
    }
    let s = past ? '' : 'in ';
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
    s += past ? ' ago' : '';

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
