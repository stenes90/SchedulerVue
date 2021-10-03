<template>
  <div class="timetable-page" id="timetable">
    <button @click="scheduleMatches">Schedule Matches</button>
    <button @click="undoVersion">Undo</button>
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
      <ContextMenu match="" timeSlot="" />
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
import ContextMenu from "./ContextMenu.vue";
import axios from "axios";
export default {
  components: { Grid, MatchSlots, ContextMenu },
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
      dragActive: false,
      scheduleVersions: [],
      activeVersion: null,
      rinData: null,
      parsedMatches: [],
      tn: {},
    };
  },
  created() {
    //this.dates = tournament.PlayingDates;
    // this.courts = tournament.Courts;
    // this.isScheduled = this.$store.getters["getIsScheduled"];
    // this.timeSlotWidth = this.timeFieldWidth(tournament.Classes);
    // this.slotWidthString = this.timeSlotWidth.toString() + "vw";
    // this.$store.dispatch("setFieldWidth", this.timeSlotWidth);
    // this.$store.dispatch("setCourts", tournament.Courts);
    console.log(tournament);
    this.dragActive = this.$store.getters["getShowContextMenu"];
    axios
      .get("http://localhost:9392/tournament/TimeSettingsJSON/11951")
      .then((res) => {
        this.rinData = res.data;
        console.log(res.data);
        //this.$store.dispatch("setCourts", res.data.Courts);
        let playingDates = [];
        for (let datee of res.data.TimeSettings.SettingsCollection) {
          let plDate = {};
          plDate.Id = datee.SettingsId;
          let dateString = datee.Day.split("(")[1];
          dateString = dateString.split(")")[0];
          let startTime = new Date(parseInt(dateString));
          let hours = datee.StartTime.split(":")[0];
          let minutes = datee.StartTime.split(":")[1];
          startTime.setHours(parseInt(hours), parseInt(minutes));
          let endTime = new Date(parseInt(dateString));
          hours = datee.EndTime.split(":")[0];
          minutes = datee.EndTime.split(":")[1];
          endTime.setHours(parseInt(hours), parseInt(minutes));
          plDate.StartTime = startTime;
          plDate.EndTime = endTime;
          plDate.Courts = res.data.Courts;
          playingDates.push(plDate);
        }
        this.dates = playingDates;
        let classes = [];
        for (let klasa of res.data.Classes) {
          let klas = {};
          klas.Id = klasa.Id;
          klas.BreakBetweenMatches = klasa.BreakTime;
          klas.MatchDuration = klasa.MatchDuration;
          klas.Name = klasa.Name;
          let classPlDates = [];
          for (let date of this.dates) {
            var day = date.StartTime.getDate();
            var month = date.StartTime.getMonth();
            var year = date.StartTime.getFullYear();
            var dateOneString = day + "-" + (month + 1) + "-" + year;
            for (let item of klasa.SelectedDates) {
              if (item == "01/01/0001") {
                continue;
              }
              let dateDecoupled = item.split("/");
              let dateStr =
                dateDecoupled[1] +
                "/" +
                dateDecoupled[0] +
                "/" +
                dateDecoupled[2];
              let dateTwo = new Date(dateStr);

              day = dateTwo.getDate();
              month = dateTwo.getMonth();
              year = dateTwo.getFullYear();
              var dateTwoString = day + "-" + (month + 1) + "-" + year;

              if (dateOneString == dateTwoString) {
                classPlDates.push(date);
              }
            }
          }
          klas.PlayingDates = classPlDates;
          classes.push(klas);
        }
        let matches = [];
        for (let matchitem of res.data.Matches) {
          const parsedMatch = {};
          parsedMatch.Id = matchitem.Id;
          parsedMatch.ClassId = matchitem.ClassId;
          parsedMatch.Player1 = matchitem.Player1;
          parsedMatch.Player2 = matchitem.Player2;
          parsedMatch.Round = matchitem.Round;
          parsedMatch.IsScheduled = false;
          parsedMatch.MatchDuration = 30;
          matches.push(parsedMatch);
        }
        this.parsedMatches = matches;

        const parsedObject = {};
        parsedObject.PlayingDates = playingDates;
        parsedObject.Classes = classes;
        parsedObject.Matches = matches;
        this.parsedObject = parsedObject;
        console.log(this.parsedMatches);

        this.isScheduled = this.$store.getters["getIsScheduled"];
        this.timeSlotWidth = this.timeFieldWidth(classes);
        this.slotWidthString = this.timeSlotWidth.toString() + "vw";
        this.$store.dispatch("setFieldWidth", this.timeSlotWidth);
        this.$store.dispatch("setCourts", res.data.Courts);
        this.$store.dispatch("setClasses", classes);
        this.$store.dispatch("setPlayingDates", playingDates);
      });
  },
  methods: {
    undoVersion() {
      const prevVersion = this.scheduleVersions[
        this.scheduleVersions.length - 1
      ];
      debugger;
      this.$store.dispatch("setMatches", prevVersion.matches);
      this.$store.dispatch("setTimeFields", prevVersion.timefields);
      console.log(prevVersion.matches);
    },
    scheduleMatches() {
      //this.matches = schedule(tournament);
      console.log(this.parsedObject);
      debugger;
      this.matches = schedule(this.parsedObject);
      this.isScheduled = true;
      //this.timeSlots = this.timeFields(tournament.PlayingDates, this.matches);
      this.timeSlots = this.timeFields(this.dates, this.matches);
      console.log(this.matches[0].StartTime);
      this.scheduleVersions.push({
        id: 0,
        matches: [...this.matches],
        timefields: [...this.timeSlots],
      });
      this.$store.dispatch("setVersions", this.scheduleVersions);
      this.activeVersion = 0;
      for (let match of this.matches) {
        match.TimeFields = [];

        const courtSlots = this.timeSlots.filter(
          (c) => c.CourtId == match.CourtId
        );
        for (let slot of courtSlots) {
          if (slot.Range.intersect(match.TimeRange)) {
            match.TimeFields.push(slot);
          }
        }
      }
      this.$store.dispatch("setTimeFields", this.timeSlots);
      this.$store.dispatch("setMatches", this.matches);
      this.$store.dispatch("setIsScheduled", true);
      // this.$store.dispatch("setClasses", tournament.Classes);
      // this.$store.dispatch("setPlayingDates", tournament.PlayingDates);

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
    },
  },
};
</script>

<style>
.courts-container {
  height: 10vh;
  position: relative;
}
</style>
