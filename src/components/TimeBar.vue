<template>
  <div :style="{ width: timeBarWidth }" className="time-bar">
    <div
      :style="{ width: timeBarStampWidthString }"
      class="time-bar-stamp"
      v-for="(bar, index) in timeBarStampsCount"
      :key="bar"
    >
      {{ time.getHours() + index }}:{{ timebarMinutes }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["date"],
  data() {
    return {
      timeBarStampsCount: null,
      time: null,
      timeBarWidth: null,
      timeBarStampWidthString: null,
    };
  },
  created() {
    const startTime = new Date(this.date.StartTime);
    const endtTime = new Date(this.date.StartTime);
    endtTime.setDate(startTime.getDate() + 1);
    endtTime.setHours(0, 0, 0);
    //time between end of day and start time in minutes
    const timeInterval = (endtTime - startTime) / 60000;
    this.timeBarStampsCount = timeInterval / 60;
    const timeFieldWidth = this.$store.getters["getFieldWidth"];
    const timeBarStampWidth = 12 * timeFieldWidth;
    this.timeBarStampWidthString = timeBarStampWidth.toString() + "vw";
    this.timeBarWidth =
      (this.timeBarStampsCount * timeBarStampWidth).toString() + "vw";

    this.time = startTime;
  },
  computed: {
    timebarMinutes() {
      if (this.time.getMinutes() < 10) {
        return "0" + this.time.getMinutes().toString();
      } else return this.time.getMinutes();
    },
  },
  methods: {
    // updatedTime() {
    //   const oldTime = this.time;
    //   debugger;
    //   //console.log(oldTime);
    //   this.time += 1;
    //   return oldTime;
    // },
  },
};
</script>

<style scoped>
.time-bar {
  display: flex;
  height: 2vh;
  font-size: 12px;
}

.time-bar-stamp {
  border: 1px white ridge;
  background-color: rgb(196, 196, 196);
}
</style>
