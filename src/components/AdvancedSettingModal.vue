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
          <td v-for="date in playingDates" :key="date.Id">
            <div class="input-group mb-3">
              <input
                type="number"
                class="form-control"
                placeholder="Max"
                :value="
                  date.AdvSchedule && date.Classes.some((c) => c.Id == klasa.Id)
                    ? klasa.Rounds.filter((c) => c.DateId == date.Id).length
                    : null
                "
                @input="updateRounds($event, klasa.Id, date.Id)"
              />
            </div>
          </td>
          <td>x</td>
          <td>x</td>
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
import DailyCheck from "../DaylyScheduleCheck";
export default {
  data() {
    return {
      classes: [],
      playingDates: [],
      showError: false,
    };
  },
  created() {
    this.playingDates = _.cloneDeep(this.$store.getters["playingDates"]);
    this.classes = _.cloneDeep(this.$store.getters["getClasses"]);
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
      console.log(this.playingDates);
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
      model.Classes = this.$store.getters["getClasses"];
      model.Matches = this.$store.getters["getMatches"];
      model.Courts = this.$store.getters["courts"];

      let matches = DailyCheck(model, date);
      debugger;
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
