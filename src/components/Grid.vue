<template>
  <div
    class="columns timeslots-container"
    :style="{ width: scrollerWidthString }"
  >
    <Timeslot
      v-for="slot in timeSlots"
      :key="slot.Id.toString() + slot.Empty.toString()"
      :slott="slot"
      :slotId="slot.Id"
      v-show="slot.Displayed"
      :slotWidthString="slotWidthString"
      :time="slot.Time"
      :index="slot.DateIndex"
      :totalIndex="slot.TotalIndex"
      :dateId="slot.DateId"
      :courtId="slot.CourtId"
      :gridIndex="gridIndex"
    />
  </div>
</template>

<script>
import moment from "moment";
import { extendMoment } from "moment-range";
import Timeslot from "./Timeslot.vue";
import { mapState } from "vuex";

export default {
  components: { Timeslot },
  props: ["date", "court", "slotWidthString", "gridIndex"],
  data() {
    return {
      timeSlotWidth: null,
      scrollerWidthString: "",
      //timeSlots: [],
      //isMatchCoppied: false,
    };
  },

  computed: {
    ...mapState(["isMatchCoppied", "timeFields"]),
  },
  watch: {
    isMatchCoppied() {
      const zIndex = this.isMatchCoppied ? "10" : "0";
      const gridContainers = document.querySelectorAll(".timeslots-container");
      for (let grid of gridContainers) {
        grid.style.zIndex = zIndex;
      }
    },
  },

  created() {
    this.timeSlotWidth = this.$store.getters["getFieldWidth"];
    // this.timeSlots = this.$store.getters["getTimeFields"];
    this.timeSlots = this.timeFields
      .filter((c) => c.DateId == this.date.Id)
      .filter((d) => d.CourtId == this.court.Id);

    const start = new Date(this.date.StartTime);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    end.setHours(0, 0, 0);

    //time between end of day and start time in minutes
    const timeInterval = (end - start) / 60000;
    const timeslotsCountForTimeInterval = timeInterval / 5;
    const scrollerWidth = timeslotsCountForTimeInterval * this.timeSlotWidth;
    this.scrollerWidthString = scrollerWidth.toString() + "vw";
  },
  methods: {},
};
</script>

<style>
* {
  box-sizing: border-box;
}

.timeslots-container {
  height: 100%;
  position: absolute;
}

.container-fluidd {
  overflow-x: auto;
  position: relative;
  border: 1px white ridge;
  margin-bottom: 30px;
  width: 95vw;
}

.court-div {
  position: relative;
}
.timeslot {
  float: left;
  height: 100%;
  /* border: 1px grey ridge; */
  font-size: 6px;
  opacity: 20%;
}

.court-name {
  height: 10vh;
  width: 5vw;
  border: 1px grey solid;
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.court-names {
  position: absolute;
}
</style>
