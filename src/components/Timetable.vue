<template>
  <div class="timetable-page" id="timetable">
    <button @click="scheduleMatches">Schedule Matches</button>
    <div class="time" v-if="isScheduled">
      <div
        class="date-container container-fluid container-scroll"
        v-for="date in dates"
        :key="date.Id"
      >
        <div
          class="courts-container"
          v-for="court in date.Courts"
          :key="court.Id"
        >
          <Grid
            :date="date"
            :court="court"
            :slotWidthString="slotWidthString"
          />
          <MatchSlots :date="date" :court="court" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vuex from "vuex";
import tournament from "../../tournament.json";
import Moment from "moment";
import { extendMoment } from "moment-range";
import schedule from "../Schedule.js";
import ScheduleMixin from "../Mixins/ScheduleMixin.vue";
import Grid from "./Grid.vue";
import MatchSlots from "./MatchSlots.vue";
export default {
  components: { Grid, MatchSlots },
  mixins: [ScheduleMixin],
  data() {
    return {
      matches: null,
      isScheduled: false,
      dates: [],
      courts: [],
      timeSlotWidth: "",
      slotWidthString: "",
      timeSlots: [],
    };
  },
  created() {
    debugger;
    this.dates = tournament.PlayingDates;
    this.courts = tournament.Courts;
    this.isScheduled = this.$store.getters["getIsScheduled"];
    this.timeSlotWidth = this.timeFieldWidth(tournament.Classes);
    this.slotWidthString = this.timeSlotWidth.toString() + "vw";
    this.$store.dispatch("setFieldWidth", this.timeSlotWidth);
    console.log(tournament);
  },
  methods: {
    scheduleMatches() {
      this.matches = schedule(tournament);
      this.isScheduled = true;
      this.timeSlots = this.timeFields(tournament.PlayingDates, this.matches);
      this.$store.dispatch("setTimeFields", this.timeSlots);
      this.$store.dispatch("setMatches", this.matches);
      this.$store.dispatch("setIsScheduled", true);
      this.$store.dispatch("setClasses", tournament.Classes);

      for (let court of this.courts) {
        court.Matches = this.matches.filter((c) => c.CourtId == court.Id);
        for (let date of this.dates) {
          let dateCourt = date.Courts.find((c) => c.Id == court.Id);
          if (dateCourt) {
            dateCourt.Matches = this.matches.filter(
              (c) => c.CourtId == court.Id
            );
          }
        }
      }

      // const start = new Date(this.date.StartTime);
      // const end = new Date(start);
      // end.setDate(start.getDate() + 1);
      // end.setHours(0, 0, 0);

      // //time between end of day and start time in minutes
      // const timeInterval = (end - start) / 60000;
      // const timeslotsCountForTimeInterval = timeInterval / 5;

      // this.timeSlotWidth = this.$store.getters["getFieldWidth"];
      // this.slotWidthString = this.timeSlotWidth.toString() + "vw";
      // const scrollerWidth = timeslotsCountForTimeInterval * this.timeSlotWidth;
      // this.scrollerWidthString = scrollerWidth.toString() + "vw";
    },
  },
};
</script>
