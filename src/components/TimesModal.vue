<template>
  <div class="times-modal-container">
    <div @click="closeModal" class="close-btn">X</div>
    <div class="playing-dates">
      <div
        v-for="date in model.PlayingDates"
        :key="date.Id"
        :class="'date-checkbox' + (date.Id == selectedDate.Id ? ' active' : '')"
        @click="selectDate(date.Id)"
      >
        {{ getDate(date.StartTime) }}
      </div>
    </div>
    <div class="time-pickers">
      <label>Start Time: </label>
      <div class="start-time time">
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">Hour</span>
          </div>
          <input
            type="number"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            :value="startHour"
            @change="updateStartHour($event)"
          />
        </div>

        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">Min</span>
          </div>
          <input
            type="number"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            :value="startMin"
            @change="updateStartMin($event)"
          />
        </div>
      </div>
      <label>End Time: </label>
      <div class="start-time time">
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">Hour</span>
          </div>
          <input
            type="number"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            :value="endHour"
            @change="updateEndHour($event)"
          />
        </div>

        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">Min</span>
          </div>
          <input
            type="number"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            :value="endMin"
            @change="updateEndMin($event)"
          />
        </div>
      </div>
    </div>
    <div class="court-checkboxes">
      <label>Select courts for date: </label>
      <br />
      <div
        v-for="court in model.Courts"
        :key="court.Id"
        :id="court.Id"
        class="form-check form-check-inline"
      >
        <input
          class="form-check-input"
          type="checkbox"
          :id="court.Id"
          :checked="courtChecked(court.Id)"
          @click="addOrRemoveCourt(court.Id)"
        />
        <label class="form-check-label" :for="court.Id">{{ court.Name }}</label>
      </div>
    </div>
    <div class="class-select">
      <div class="dropdown">
        <a
          class="btn btn-secondary btn-sm dropdown-toggle"
          href="#"
          role="button"
          id="dropdownMenuLink"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ selectedClass.Name }}
        </a>

        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a
            v-for="klasa in model.Classes"
            :key="klasa.Id"
            class="dropdown-item"
            @click="selectClass(klasa.Id)"
            >{{ klasa.Name }}</a
          >
        </div>
      </div>
    </div>
    <div class="match-duration-break">
      <div class="match-duration time">
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm"
              >Match Duration:</span
            >
          </div>
          <input
            type="number"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            :value="matchDuration"
            @change="updateDuration($event)"
          />
        </div>
      </div>
      <div class="match-duration time">
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm"
              >Minimum Break:</span
            >
          </div>
          <input
            type="number"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            :value="BreakBetweenMatches"
            @change="updateBreak($event)"
          />
        </div>
      </div>
      <button
        type="button"
        @click="saveChanges"
        class="btn btn-primary save-btn"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";
export default {
  computed: {
    ...mapState(["model"]),
    startHour() {
      let date = new Date(this.selectedDate.StartTime);
      let h = date.getHours();
      return h;
    },
    endHour() {
      let date = new Date(this.selectedDate.EndTime);
      let h = date.getHours();
      return h;
    },
    startMin() {
      let date = new Date(this.selectedDate.StartTime);
      let h = date.getMinutes();
      return h;
    },
    endMin() {
      let date = new Date(this.selectedDate.EndTime);
      let h = date.getMinutes();
      return h;
    },
    matchDuration() {
      return this.selectedClass.MatchDuration;
    },
    BreakBetweenMatches() {
      return this.selectedClass.BreakBetweenMatches;
    },
  },
  data() {
    return {
      selectedClass: null,
      selectedDate: null,
      dates: null,
      classes: null,
    };
  },
  created() {
    this.dates = _.cloneDeep(this.model.PlayingDates);
    this.classes = _.cloneDeep(this.model.Classes);
    this.selectedDate = this.dates[0];
    this.selectedClass = this.classes[0];
  },
  methods: {
    closeModal() {
      this.$store.dispatch("setShowModal", false);
    },
    selectDate(id) {
      this.selectedDate = this.dates.find((c) => c.Id == id);
    },
    updateStartHour(e) {
      let d = new Date(this.selectedDate.StartTime);
      d.setHours(e.target.value);
      this.selectedDate.StartTime = d;
    },
    updateEndHour(e) {
      let d = new Date(this.selectedDate.EndTime);
      d.setHours(e.target.value);
      this.selectedDate.EndTime = d;
    },
    updateStartMin(e) {
      let d = new Date(this.selectedDate.StartTime);
      d.setMinutes(e.target.value);
      this.selectedDate.StartTime = d;
    },
    updateEndMin(e) {
      let d = new Date(this.selectedDate.EndTime);
      d.setMinutes(e.target.value);
      this.selectedDate.EndTime = d;
    },
    courtChecked(id) {
      let court = this.selectedDate.Courts.find((c) => c.Id == id);
      return court ? true : false;
    },
    addOrRemoveCourt(id) {
      if (this.selectedDate.Courts.find((c) => c.Id == id)) {
        this.selectedDate.Courts = this.selectedDate.Courts.filter(
          (c) => c.Id != id
        );
      } else {
        const court = this.model.Courts.find((c) => c.Id == id);
        this.selectedDate.Courts.push(court);
        //   initialFieldsForCoppiedMatches = initialFieldsForCoppiedMatches.sort(
        //   (a, b) => {
        //     return a - b;
        //   }
        // );
        debugger;
        this.selectedDate.Courts = this.selectedDate.Courts.sort((a, b) => {
          return a.Id - b.Id;
        });
      }
    },
    selectClass(id) {
      this.selectedClass = this.classes.find((c) => c.Id == id);
    },
    updateBreak(e) {
      this.selectedClass.BreakBetweenMatches = parseInt(e.target.value);
    },
    updateDuration(e) {
      this.selectedClass.MatchDuration = parseInt(e.target.value);
    },
    saveChanges() {
      this.$store.dispatch("setPlayingDates", this.dates);
      this.$store.dispatch("setClasses", this.classes);
      let mod = _.cloneDeep(this.model);
      mod.PlayingDates = this.dates;
      mod.Classes = this.classes;
      this.$store.dispatch("setModel", mod);

      this.$store.dispatch("setShowModal", false);
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
  },
};
</script>

<style>
.times-modal-container {
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
.playing-dates {
  display: flex;
  margin: 20px;
}

.date-checkbox {
  height: 60px;
  border: 1px black solid;
  margin-right: 10px;
  padding: 5px;
}

.date-checkbox:hover {
  cursor: pointer;
}

.date-checkbox.active {
  background-color: rgb(111, 111, 243);
}

.time-pickers,
.class-select {
  margin-left: 20px;
}

.time-pickers .time {
  display: flex;
}

.time-pickers .input-group {
  width: 120px !important;
}

.court-checkboxes {
  margin: 10px 20px;
}
.court-checkboxes input {
  width: 20px;
  height: 20px;
}

.match-duration-break .time {
  width: 250px;
}
.match-duration-break {
  margin: 20px;
}

.save-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}

.close-btn:hover {
  cursor: pointer;
}
</style>
