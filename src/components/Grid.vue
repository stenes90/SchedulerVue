<template>
  <div
    class="row columns timeslots-container"
    :style="{ width: scrollerWidthString, zIndex: gridZindex }"
  >
    <Timeslot
      v-for="slot in timeSlots"
      :key="slot.Id"
      :slott="slot"
      :slotId="slot.Id"
      v-show="slot.Displayed"
      :slotWidthString="slotWidthString"
      :time="slot.Time"
      :index="slot.Index"
      :dateId="slot.DateId"
      :courtId="slot.CourtId"
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
  props: ["date", "court", "slotWidthString"],
  data() {
    return {
      timeSlotWidth: null,
      scrollerWidthString: "",
      timeSlots: [],
      //isMatchCoppied: false,
    };
  },
  computed: {
    ...mapState(["isMatchCoppied"]),
    gridZindex() {
      return this.isMatchCoppied ? "10" : "0";
    },
  },

  created() {
    this.timeSlotWidth = this.$store.getters["getFieldWidth"];
    this.timeSlots = this.$store.getters["getTimeFields"];
    this.timeSlots = this.timeSlots
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

.container-fluid {
  overflow-x: auto;
  position: relative;
}

.court-div {
  position: relative;
}
.timeslot {
  float: left;
  height: 100%;
  border: 1px grey ridge;
  font-size: 6px;
  opacity: 50%;
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
