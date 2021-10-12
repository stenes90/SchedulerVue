<template>
  <div
    @drop="onDrop($event, slott)"
    @dragenter.prevent
    @dragover.prevent
    v-show="displayed"
    class="timeslot"
    :data-slotId="slotId"
    :data-time="time"
    :data-index="index"
    :data-dateId="dateId"
    :data-courtId="courtId"
    :style="{ width: slotWidthString, backgroundColor: backgroundColor }"
    @contextmenu="rightClick"
    @mouseover="onHover(dateId, slotId, time)"
    @mouseleave="endHover"
  >
    {{ slotId }}
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ScheduleMixin from "../Mixins/ScheduleMixin.vue";
export default {
  mixins: [ScheduleMixin],
  props: [
    "slotId",
    "slott",
    "slotWidthString",
    "time",
    "index",
    "dateId",
    "courtId",
    "displayed",
    "gridIndex",
  ],
  data() {
    return {
      isMatchCoppied: false,
    };
  },
  computed: {
    ...mapGetters(["getisMatchCoppied"]),
    ...mapState(["dragActive"]),
    backgroundColor() {
      if (parseInt(this.gridIndex) % 2 == 0) {
        return parseInt(this.slotId) % 2 == 0 ? "white" : "#a9a9a9";
      } else return parseInt(this.slotId) % 2 == 0 ? "#a9a9a9" : "white";
    },
  },
  created() {
    console.log("timeslot created");
    this.isMatchCoppied = this.$store.getters["getisMatchCoppied"];
  },
  updated() {
    console.log("timeslot updated");
  },
  methods: {
    rightClick(e) {
      if (this.getisMatchCoppied) {
        e.preventDefault();
        this.$store.dispatch("setShowContextMenu", true);
        this.$store.dispatch("setSelectedTimeslot", this.slott);
        this.$store.dispatch("setXpos", e.pageX + "px");
        this.$store.dispatch("setYpos", e.pageY + "px");
      } else {
        e.preventDefault();
        this.$store.dispatch("setShowContextMenu", false);
      }
    },
    onHover(dateId, slotId, date) {
      if (!this.dragActive) {
        return;
      }
      let hoveredSlot = {};
      hoveredSlot.DateId = dateId;
      hoveredSlot.SlotId = slotId;
      const dateObj = new Date(date);
      let hours = "";
      let minutes = "";
      if (dateObj.getHours() < 10) {
        hours = "0" + dateObj.getHours().toString();
      } else {
        hours = dateObj.getHours().toString();
      }

      if (dateObj.getMinutes() < 10) {
        minutes = "0" + dateObj.getMinutes().toString();
      } else {
        minutes = dateObj.getMinutes().toString();
      }
      const time = hours + ":" + minutes;
      hoveredSlot.Hour = hours;
      hoveredSlot.Minutes = minutes;

      hoveredSlot.Time = time;
      this.$store.dispatch("setHoveredSlot", hoveredSlot);
    },
    endHover() {
      // this.$store.dispatch("setHoveredSlot", null);
    },
    // onDrop(e, slot) {
    //   console.log("dropped");
    //   console.log(e);
    //   const firstMatch = e.dataTransfer.getData("firstMatch");
    //   this.pasteMatch(slot, firstMatch);
    // },
  },
};
</script>

<style scoped>
.timeslot {
  font-size: 8px;
  border-bottom: 2px ridge #9f9f9f;
}
</style>
