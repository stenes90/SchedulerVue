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
    :style="{ zIndex: zIndex, width: slotWidthString }"
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
    "zIndex",
    "time",
    "index",
    "dateId",
    "courtId",
    "displayed",
  ],
  data() {
    return {
      isMatchCoppied: false,
    };
  },
  computed: {
    ...mapGetters(["getisMatchCoppied"]),
  },
  created() {
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
}
</style>
