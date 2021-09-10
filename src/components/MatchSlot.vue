<template>
  <div
    class="match match-slot"
    :style="{
      left: matchPositionLeft,
      width: matchWidth,
      backgroundColor: color,
    }"
  >
    <p>{{ time }}</p>
    <p>{{ match.Id }}</p>
  </div>
</template>

<script>
import moment from "moment";
import { extendMoment } from "moment-range";

export default {
  props: ["match"],
  data() {
    return {
      classes: [],
      matchStartTime: "",
      dateStartTime: "",
      matchPositionLeft: "",
      matchWidth: "",
      colors: ["#034f84", "#c94c4c", "#50394c", "#b1cbbb", "#4040a1"],
    };
  },
  computed: {
    color() {
      let classs = this.classes.find((c) => c.Id == this.match.ClassId);
      let index = this.classes.indexOf(classs);
      return this.colors[index];
    },
    time() {
      return moment(this.matchStartTime).format("LT");
    },
  },

  created() {
    this.classes = this.$store.getters["getClasses"];
    this.matchStartTime = moment(this.match.StartTime);
    this.dateStartTime = moment(this.match.PlayingDate.StartTime);
    const timeSlotWidth = this.$store.getters["getFieldWidth"];
    let minutesFromStart = this.matchStartTime.diff(
      this.dateStartTime,
      "minutes"
    );
    this.matchPositionLeft =
      ((minutesFromStart / 5) * timeSlotWidth).toString() + "vw";
    this.matchWidth =
      (
        (parseInt(this.match.MatchDuration) / 5) *
        parseFloat(timeSlotWidth)
      ).toString() + "vw";
  },
};
</script>

<style scoped>
.match {
  position: absolute;

  top: 0;
  border: 1px black solid;
  height: 10vh;
}

.match p {
  color: white;
  font-size: 10px;
}
</style>
