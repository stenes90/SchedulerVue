<template>
  <div
    draggable="true"
    @dragstart="startDrag($event, match)"
    @dragend="endDrag($event, match)"
    class="match match-slot"
    :style="{
      left: matchPositionLeft,
      width: matchWidth,
      backgroundColor: color,
    }"
    @contextmenu="rightClick"
  >
    <p>{{ time }}</p>
    <p>{{ match.Id }}</p>
  </div>
</template>

<script>
import moment from "moment";
import { extendMoment } from "moment-range";
import { mapGetters } from "vuex";

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
    ...mapGetters(["getisMatchCoppied"]),
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
    console.log("created");
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
  updated() {
    console.log("updated");
  },
  methods: {
    rightClick(e) {
      if (!this.getisMatchCoppied) {
        e.preventDefault();
        this.$store.dispatch("setShowContextMenu", true);
        this.$store.dispatch("setSelectedMatch", this.match);
        this.$store.dispatch("setXpos", e.pageX + "px");
        this.$store.dispatch("setYpos", e.pageY + "px");
      } else return;
    },
    // startDrag(e, match) {
    //   this.$store.dispatch("setIsMatchCoppied", true);
    //   this.$store.dispatch("setCoppiedMatch", match);
    // },
    startDrag(e, match) {
      console.log("drag start");
      console.log(e);

      const ghost = e.srcElement;

      e.dataTransfer.setDragImage(ghost, 5, 50);
      // console.log(ghost);
      //ghost.style.backgroundColor = "green";
      setTimeout(() => {
        this.$store.dispatch("setIsMatchCoppied", true);
      }, 100);
      this.$store.dispatch("setCoppiedMatch", match);
    },
    endDrag(e, match) {
      console.log("drag end");
      this.$store.dispatch("setIsMatchCoppied", false);
      this.$store.dispatch("setCoppiedMatch", null);
    },
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
