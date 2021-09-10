<script>
import tournament from "../../tournament.json";
import Moment from "moment";
import { extendMoment } from "moment-range";
export default {
  methods: {
    timeFieldWidth(classes) {
      // CALCULATING TIMEFIELD WIDTH START
      let matchDurations = [];
      classes.forEach((classs) => {
        matchDurations.push(parseInt(classs.MatchDuration));
      });
      const smallestMatchDuration = Math.min(...matchDurations);
      // number of 5min fields that covers the smallest match
      const smallestMatchDurationTimeFieldsCount = smallestMatchDuration / 5;
      //Initial Grid should be able to fill 12 matches with minimum duration
      //In 100vw it should fill 12 x "smallestMatchDurationTimeFieldsCount"
      const totalTimeFieldsPerVW = 12 * smallestMatchDurationTimeFieldsCount;
      // In 100vw we show always 5vw for the name of court and 95vw for 15 matches with smallest duration
      const timeFieldWidth = 95 / totalTimeFieldsPerVW;
      // CALCULATING TIMEFIELD WIDTH END
      return timeFieldWidth;
    },

    timeFields(dates, matches) {
      const timeSlots = [];
      const moment = extendMoment(Moment);
      let counter = 0;
      //dates.forEach((date) => {
      for (let date of dates) {
        const dateCourts = date.Courts;
        dateCourts.forEach((court) => {
          const startTime = moment(date.StartTime);
          const endtTime = moment(startTime).add(1, "day");
          // endtTime.setDate(startTime.getDate() + 1);
          // endtTime.setHours(0, 0, 0);

          let initialTime = new Date(date.StartTime);
          initialTime.setHours(0, 0, 0);
          initialTime = moment(initialTime);
          for (let i = 0; i < 288; i++) {
            const start = initialTime;
            const end = moment(start);
            end.add(5, "m");
            const range = moment.range(start, end);
            const displayed = start < startTime ? false : true;
            let empty = true;
            matchesLoop: for (let match of matches) {
              if (range.intersect(match.TimeRange)) {
                empty = false;
                break matchesLoop;
              }
            }
            timeSlots.push({
              id: counter,
              time: initialTime,
              index: counter,
              dateId: date.Id,
              courtId: court.Id,
              range: range,
              displayed: displayed,
              empty: empty,
            });
            initialTime.add(5, "m");
            counter++;
          }
        });
      }
      return timeSlots;
    },

    copyMatch(match) {
      this.$store.dispatch("setIsMatchCoppied", true);
      this.$store.dispatch("setCoppiedMatch", match);
    },
  },
};
</script>
