<template>
  <div class="advanced-setting-modal-container">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">Order</th>
          <th scope="col">Class</th>
          <th v-for="date in model.PlayingDates" :key="date.Id" scope="col">
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
          <td v-for="date in model.PlayingDates" :key="date.Id">
            <div class="input-group mb-3">
              <input type="number" class="form-control" placeholder="Max" />
            </div>
          </td>
          <td>x</td>
          <td>x</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";
export default {
  computed: {
    ...mapState(["model"]),
  },
  data() {
    return {
      classes: [],
    };
  },
  created() {
    this.classes = _.cloneDeep(this.model.Classes);
  },
  methods: {
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
</style>
