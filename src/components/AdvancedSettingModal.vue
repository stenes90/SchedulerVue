<template>
  <div class="advanced-setting-modal-container">
    <div @click="close" class="close">X</div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">Order</th>
          <th scope="col">Class</th>
          <th v-for="date in playingDates" :key="date.Id" scope="col">
            {{ getDate(date.StartTime) }}
          </th>
          <th scope="col">Total rounds</th>
          <th scope="col">Total matches</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="klasa in classes" :key="klasa.Id">
          <td>
            <div class="buttons-arrows">
              <button
                @click="swapPlus(klasa.Id)"
                type="button"
                class="btn btn-outline-secondary"
              >
                ↑
              </button>
              <button
                @click="swapMinus(klasa.Id)"
                type="button"
                class="btn btn-outline-secondary"
              >
                ↓
              </button>
            </div>
          </td>
          <td>{{ klasa.Name }}</td>
          <td v-for="(date, index) in playingDates" :key="date.Id">
            <div class="input-group mb-3">
              <input
                :readonly="index == playingDates.length - 1"
                type="number"
                class="form-control"
                placeholder="Max"
                :value="
                  date.AdvSchedule && date.Classes.some((c) => c.Id == klasa.Id)
                    ? date.Classes.find((c) => c.Id == klasa.Id).Rounds.filter(
                        (c) => c.DateId == date.Id
                      ).length //? klasa.Rounds.filter((c) => c.DateId == date.Id).length
                    : null
                "
                @input="updateRounds($event, klasa.Id, date.Id)"
              />
            </div>
          </td>
          <td>{{ totalRoundsForClass(klasa.Id) }}</td>
          <td>{{ totalMatchesForClass(klasa.Id) }}</td>
        </tr>
      </tbody>
    </table>
    <table v-if="model != null" class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Scheduled Slots for date %</th>
          <th scope="col">Last Match End Time</th>
          <th scope="col">Total Matches</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="date in playingDates" :key="date.Id">
          <td>{{ getDate(date.StartTime) }}</td>
          <td>{{ scheduledPercent(date.Id) }}</td>
          <td>{{ lastMatchEndTime(date.Id) }}</td>
          <td>{{ totalMatchesForDate(date.Id) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="errorMsg">
      In order yo use Adv Schedule, you must fill all round inputs for a Date
    </p>
    <button type="button" @click="saveChanges" class="btn btn-primary save-btn">
      Save
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";
import Moment from "moment";

import DailyCheck from "../DaylyScheduleCheck";
import ScheduleMixin from "../Mixins/ScheduleMixin.vue";

export default {
  mixins: [ScheduleMixin],
  data() {
    return {
      classes: [],
      playingDates: [],
      showError: false,
      model: null,
      matches: [],
    };
  },
  created() {
    this.playingDates = _.cloneDeep(this.$store.getters["playingDates"]);
    this.classes = _.cloneDeep(this.$store.getters["getClasses"]);
    this.matches = this.$store.getters["getMatches"];
    debugger;
    if (this.playingDates.some((c) => c.AdvSchedule)) {
      const model = {};
      model.PlayingDates = this.playingDates;
      model.Matches = this.$store.getters["getMatches"];
      model.Classes = this.$store.getters["getClasses"];
      model.Courts = this.$store.getters["courts"];
      let matches = DailyCheck(model);
      model.Matches = matches;
      this.model = model;
      this.matches = matches;
    }
    debugger;
  },
  computed: {
    errorMsg() {
      for (let date of this.playingDates) {
        if (date.Classes.length == 0) {
          continue;
        }
        if (date.Classes.length != this.classes.length) {
          return true;
        }
      }

      return false;
    },
  },
  methods: {
    saveChanges() {
      console.log(this.classes);
      console.log(this.$store.getters["getClasses"]);
      let classes = [];
      for (let kl of this.classes) {
        const klasa = this.$store.getters["getClasses"].find(
          (c) => c.Id == kl.Id
        );
        classes.push(klasa);
      }
      debugger;
      this.$store.dispatch("setClasses", classes);
      this.$store.dispatch("setPlayingDates", this.playingDates);
      this.$store.dispatch("setShowAdvModal", false);
    },
    swapPlus(classId) {
      let klasa = this.classes.find((c) => c.Id == classId);
      let itemIndex = this.classes.indexOf(klasa);
      if (itemIndex == 0) {
        return;
      }
      let prevItem = this.classes[itemIndex - 1];
      this.classes[itemIndex] = prevItem;
      this.classes[itemIndex - 1] = klasa;
    },
    swapMinus(classId) {
      let klasa = this.classes.find((c) => c.Id == classId);
      let itemIndex = this.classes.indexOf(klasa);
      if (itemIndex == this.classes.length - 1) {
        return;
      }
      let nextItem = this.classes[itemIndex + 1];
      this.classes[itemIndex] = nextItem;
      this.classes[itemIndex + 1] = klasa;
    },
    getDate(date) {
      var d = new Date(date);
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      return d.getDate() + " " + monthNames[d.getMonth()];
    },
    close() {
      this.$store.dispatch("setShowAdvModal", false);
    },
    updateRounds(e, classId, dateId) {
      let roundsForClassAndDate = null;
      const date = this.playingDates.find((c) => c.Id == dateId);
      const klasa = this.classes.find((c) => c.Id == classId);
      roundsForClassAndDate = klasa.Rounds.filter((c) => c.DateId == dateId);
      for (let r of roundsForClassAndDate) {
        r.DateId = null;
      }
      let inputVal = "";
      if (e.target.value != "") {
        if (
          parseInt(e.target.value) >
          klasa.Rounds.filter((c) => c.DateId == null).length
        ) {
          inputVal = klasa.Rounds.filter((c) => c.DateId == null).length;
        } else inputVal = parseInt(e.target.value);
      }
      if (!date.AdvSchedule && date.Classes.length == 0) {
        for (let klas of this.classes) {
          const r = {};
          r.Id = klas.Id;
          r.Rounds = [];
          date.Classes.push(r);
        }
      }
      if (inputVal.toString() == "") {
        // roundsForClassAndDate = klasa.Rounds.filter((c) => c.DateId == dateId);
        // for (let r of roundsForClassAndDate) {
        //   r.DateId = null;
        // }
        if (date.Classes.length <= 1) {
          date.AdvSchedule = false;
          date.Classes = [];
          this.showError = false;
        } else {
          date.Classes = date.Classes.filter((c) => c.Id != classId);
          this.showError = true;
        }
      } else {
        if (date.Classes.some((c) => c.Id == classId)) {
          // roundsForClassAndDate = klasa.Rounds.filter(
          //   (c) => c.DateId == dateId
          // );
          // for (let r of roundsForClassAndDate) {
          //   r.DateId = null;
          // }
          date.Classes = date.Classes.filter((c) => c.Id != classId);
        }

        date.AdvSchedule = true;
        const numberOfRounds = parseInt(inputVal);
        const rounds = klasa.Rounds.filter((c) => c.DateId == null);
        let newClass = {};
        newClass.Id = classId;
        newClass.Rounds = [];
        if (rounds.length > 0) {
          for (let i = 0; i < numberOfRounds; i++) {
            rounds[i].DateId = dateId;
            newClass.Rounds.push(rounds[i]);
          }
          console.log(newClass);
        }
        date.Classes = date.Classes.filter((c) => c.Id != classId);
        date.Classes.push(newClass);
        this.showError = false;
      }
      const model = {};
      model.PlayingDates = this.playingDates;
      model.Matches = this.$store.getters["getMatches"];
      model.Classes = this.$store.getters["getClasses"];
      model.Courts = this.$store.getters["courts"];

      let matches = DailyCheck(model);
      model.Matches = matches;
      this.model = model;
    },
    scheduledPercent(dateId) {
      //const moment = extendMoment(Moment);
      const timefields = this.generateTimeFields(
        this.model.PlayingDates,
        this.model.Matches
      );
      const date = this.model.PlayingDates.find((c) => c.Id == dateId);
      const dateEndTime = Moment(date.EndTime);
      const totalDisplayedTimefieldsForDate = timefields
        .filter((c) => c.DateId == dateId)
        .filter((d) => d.Displayed == true)
        .filter((e) => Moment(e.Time) < dateEndTime);

      const totalBusyFieldsForDate = totalDisplayedTimefieldsForDate.filter(
        (c) => c.Empty == false
      );
      let percent =
        totalBusyFieldsForDate.length /
        (totalDisplayedTimefieldsForDate.length / 100);
      percent = Math.round(percent);

      debugger;
      return percent.toString() + "%";
    },
    lastMatchEndTime(dateId) {
      let lastMatchDate = Moment(new Date(0, 0, 0));
      let matchesForDate = this.model.Matches.filter(
        (c) => c.PlayingDate.Id == dateId
      );
      for (let match of matchesForDate) {
        if (Moment(match.EndTime) > lastMatchDate) {
          lastMatchDate = Moment(match.EndTime);
        }
      }

      return matchesForDate.length == 0
        ? "No Matches for this date"
        : lastMatchDate.format("hh:mm");
    },

    totalMatchesForDate(dateId) {
      let matchesForDate = this.model.Matches.filter(
        (c) => c.PlayingDate.Id == dateId
      );

      return matchesForDate.length.toString();
    },

    totalRoundsForClass(classId) {
      debugger;
      let matchesForClass = this.matches.filter((c) => c.ClassId == classId);
      let rounds = [];
      for (let match of matchesForClass) {
        rounds.push(parseInt(match.Round));
      }
      return Math.max(...rounds).toString();
    },
    totalMatchesForClass(classId) {
      let matchesForClass = this.matches.filter((c) => c.ClassId == classId);

      return matchesForClass.length.toString();
    },
  },
};
</script>

<style scoped>
.advanced-setting-modal-container {
  width: 600px;
  height: 600px;
  background-color: white;
  border: 1px black solid;
  position: absolute;
  top: 150px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}

.buttons-arrows {
  display: flex;
}

.save-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
