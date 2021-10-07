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
  >
    {{ slotId }}
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
    backgroundColor() {
      if (parseInt(this.gridIndex) % 2 == 0) {
        return parseInt(this.slotId) % 2 == 0 ? "white" : "#a9a9a9";
      } else return parseInt(this.slotId) % 2 == 0 ? "#a9a9a9" : "white";
    },
  },
  created() {
    this.isMatchCoppied = this.$store.getters["getisMatchCoppied"];
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
  font-size: 5px;
  border-bottom: 2px ridge #9f9f9f;
}
</style>
