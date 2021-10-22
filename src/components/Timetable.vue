<template>
  <div class="timetable-page" id="timetable">
    <button @click="scheduleMatches">Schedule Matches</button>
    <button :disabled="activeVersion == 0" @click="undoVersion">
      Undo
    </button>
    <button
      :disabled="versions.length - 1 <= activeVersion"
      @click="redoVersion"
    >
      Redo
    </button>

    <button @click="showTimesModal">Times</button>
    <button @click="showAdvTimesModal">Advanced Settings</button>

    <div class="time">
      <div
        class="date-container"
        v-for="date in dates"
        :key="date.Id + datesUpdater"
      >
        <div class="court-info">
          <div class="date">
            <p>{{ date.StartTime.toDateString().slice(0, -5) }}</p>
          </div>
          <div class="court" v-for="court in date.Courts" :key="court.Id">
            <p>{{ court.Name }}</p>
          </div>
        </div>
        <div class="container-fluidd container-scrolll">
          <TimeBar :date="date" :slotWidthString="slotWidthString" />
          <div
            class="courts-container"
            v-for="(court, index) in date.Courts"
            :key="court.Id"
          >
            <Grid
              :date="date"
              :court="court"
              :gridIndex="index"
              :slotWidthString="slotWidthString"
            />
            <MatchSlots :date="date" :court="court" />
          </div>
        </div>
      </div>
      <ContextMenu match="" timeSlot="" />
      <TimesModal v-if="showModal" />
      <AdvancedSettingModal v-if="showAdvModal" />
      <ErrorModal v-if="showScheduleErrorModal" />
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
import TimeBar from "./TimeBar.vue";
import TimesModal from "./TimesModal.vue";
import AdvancedSettingModal from "./AdvancedSettingModal.vue";
import ErrorModal from "./ErrorModal.vue";
import { mapState } from "vuex";

import axios from "axios";
import _ from "lodash";
export default {
  components: {
    Grid,
    MatchSlots,
    ContextMenu,
    TimeBar,
    TimesModal,
    AdvancedSettingModal,
    ErrorModal,
  },
  mixins: [ScheduleMixin],
  computed: {
    ...mapState([
      "activeVersion",
      "versions",
      "showModal",
      "showAdvModal",
      "model",
      "showScheduleErrorModal",
      "timeFields",
      "matches",
    ]),
  },
  data() {
    return {
      isScheduled: false,
      dates: [],
      courts: [],
      timeSlotWidth: "",
      slotWidthString: "",
      //timeSlots: [],
      dragActive: false,
      rinData: null,
      datesUpdater: 0,
      tn: {},
    };
  },
  watch: {
    model() {
      const timeSlots = this.generateTimeFields(
        this.$store.getters["playingDates"],
        this.matches
      );
      if (this.isScheduled) {
        this.updateMatchTimeslotsAndBusySlots(this.matches);
      }
      const version = _.cloneDeep({
        id: 0,
        matches: this.matches,
        timefields: timeSlots,
      });
      const versions = [];
      versions.push(version);

      this.$store.dispatch("setVersions", versions);
      this.$store.dispatch("setActiveVersion", 0);

      this.$store.dispatch("setTimeFields", timeSlots);
      //this.$store.dispatch("setPlayingDates", this.model.PlayingDates);
      this.dates = this.$store.getters["playingDates"];
      this.datesUpdater += 1000;
    },
  },
  created() {
    //this.dragActive = this.$store.getters["getShowContextMenu"];

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
          plDate.Classes = [];
          plDate.AdvSchedule = false;
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
                let plDate = {};
                plDate.Id = date.Id;
                plDate.Rounds = null;
                // plDate.AdvSchedule = false;

                classPlDates.push(plDate);
              }
            }
          }

          //adding class rounds START
          const classMatches = res.data.Matches.filter(
            (c) => c.ClassId == klasa.Id
          );
          let rounds = [];
          klas.Rounds = [];
          for (let match of classMatches) {
            rounds.push(match.Round);
          }
          rounds = [...new Set(rounds)];
          for (let it of rounds) {
            let r = {};
            r.Id = it;
            r.DateId = null;
            klas.Rounds.push(r);
          }

          //adding class rounds END

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

        const parsedObject = {};
        parsedObject.PlayingDates = playingDates;
        parsedObject.Classes = classes;
        parsedObject.Matches = matches;
        parsedObject.Courts = res.data.Courts;

        this.parsedObject = parsedObject;
        console.log(this.parsedObject);
        this.timeFields = this.generateTimeFields(this.dates, matches);
        this.$store.dispatch("setModel", this.parsedObject);
        this.$store.dispatch("setTimeFields", this.timeSlots);
        this.$store.dispatch("setMatches", matches);
        this.timeSlotWidth = this.timeFieldWidth(classes);
        this.slotWidthString = this.timeSlotWidth.toString() + "vw";
        this.$store.dispatch("setFieldWidth", this.timeSlotWidth);
        this.$store.dispatch("setCourts", res.data.Courts);
        this.$store.dispatch("setClasses", classes);
        this.$store.dispatch("setPlayingDates", this.dates);
      });
  },
  methods: {
    undoVersion() {
      //this.scheduleVersions = this.$store.getters["getVersions"];
      const activeVersionId = this.$store.getters["getActiveVersion"];
      const prevVersion = this.versions.find(
        (c) => c.id == activeVersionId - 1
      );
      const matches = _.cloneDeep(prevVersion.matches);
      const timefields = _.cloneDeep(prevVersion.timefields);
      this.$store.dispatch("setMatches", matches);
      this.$store.dispatch("setTimeFields", timefields);
      this.$store.dispatch("setActiveVersion", activeVersionId - 1);
    },
    redoVersion() {
      //this.scheduleVersions = this.$store.getters["getVersions"];
      const activeVersionId = this.$store.getters["getActiveVersion"];
      const nextVersion = this.versions.find(
        (c) => c.id == activeVersionId + 1
      );
      const matches = _.cloneDeep(nextVersion.matches);
      const timefields = _.cloneDeep(nextVersion.timefields);
      this.$store.dispatch("setMatches", matches);
      this.$store.dispatch("setTimeFields", timefields);
      this.$store.dispatch("setActiveVersion", activeVersionId + 1);
    },
    showTimesModal() {
      this.$store.dispatch("setShowModal", true);
    },
    showAdvTimesModal() {
      this.$store.dispatch("setShowAdvModal", true);
    },
    scheduleMatches() {
      this.$store.dispatch("setActiveVersion", 0);
      this.$store.dispatch("setVersions", []);
      for (let match of this.matches) {
        match.IsScheduled = false;
      }

      const model = {};
      model.PlayingDates = this.$store.getters["playingDates"];
      model.Classes = this.$store.getters["getClasses"];
      model.Matches = this.matches;
      model.Courts = this.$store.getters["courts"];

      let matches = schedule(model);
      this.updateMatchTimeslotsAndBusySlots(matches);
      const timeSlots = this.generateTimeFields(
        this.$store.getters["playingDates"],
        matches
      );

      this.isScheduled = true;
      const version = _.cloneDeep({
        id: 0,
        matches: matches,
        timefields: timeSlots,
      });
      this.versions.push(version);
      this.$store.dispatch("setVersions", this.versions);
      this.$store.dispatch("setIsScheduled", true);
      this.$store.dispatch("setTimeFields", timeSlots);
      this.$store.dispatch("setMatches", matches);
      this.datesUpdater += 1000;
    },
    updateMatchTimeslotsAndBusySlots(matches) {
      for (let match of matches) {
        match.TimeFields = [];

        const courtSlots = this.timeFields.filter(
          (c) => c.CourtId == match.CourtId
        );
        for (let slot of courtSlots) {
          if (slot.Range.intersect(match.TimeRange)) {
            match.TimeFields.push(slot);
            slot.Empty = false;
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

.date-container {
  display: flex;
  margin: 10px;
}

.court-info {
  width: 8vw;
  padding-top: 1px;
}

.court-info div.court {
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px white ridge;
  background-color: rgb(196, 196, 196);
}

.court-info p {
  width: 100%;
  text-align: center;
  margin: 0;
}
.court-info div.date {
  width: 100%;
  text-align: center;
  height: 4vh;
  border: 1px white ridge;
  background-color: rgb(196, 196, 196);
}
</style>
