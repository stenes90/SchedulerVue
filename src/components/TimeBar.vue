<template>
  <div :style="{ width: timeBarWidth }" className="time-bar">
    <div
      v-if="initialTimestampWidthString != ''"
      :style="{ width: initialTimestampWidthString }"
      class="time-bar-hour"
    >
      <div class="one-hour">
        <p>{{ time.getHours() }}:{{ timebarMinutes }}</p>
      </div>
      <div class="fractions">
        <TimeBarFraction
          :style="{ width: slotWidthString }"
          v-for="(tenMin, indexx) in 12 * initialTimestampWidth"
          :key="indexx"
          :index="indexx"
          :minutes="orderedMinutesNotEqual[indexx]"
          :hour="time.getHours() + index"
          :dateId="date.Id"
        />
      </div>
    </div>
    <div
      :style="{ width: timeBarStampWidthString }"
      class="time-bar-hour"
      v-for="(bar, index) in Math.floor(timeBarStampsCount) + 1"
      :key="bar"
    >
      <div class="one-hour">
        <p>{{ time.getHours() + index }}:00</p>
      </div>
      <div class="fractions">
        <TimeBarFraction
          :style="{ width: slotWidthString }"
          v-for="(tenMin, indexx) in 12"
          :key="indexx"
          :index="indexx"
          :minutes="orderedMinutes[indexx]"
          :hour="time.getHours() + index"
          :dateId="date.Id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TimeBarFraction from "./TimeBarFraction.vue";

export default {
  components: { TimeBarFraction },
  props: ["date", "slotWidthString"],
  data() {
    return {
      timeBarStampsCount: null,
      time: null,
      initialTimestampWidthString: "",
      initialTimestampWidth: null,
      timeBarWidth: null,
      timeBarStampWidthString: null,
    };
  },
  computed: {
    ...mapState(["dragActive"]),

    timebarMinutes() {
      if (this.time.getMinutes() < 10) {
        return "0" + this.time.getMinutes().toString();
      } else return this.time.getMinutes();
    },
    orderedMinutes() {
      debugger;
      if (this.initialTimestampWidthString == "") {
        const initMinutes = this.time.getMinutes();
        const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        let orderedMinutes = [];
        for (let item of minutes) {
          if (item >= initMinutes) {
            if (item == 0) {
              orderedMinutes.push("00");
            } else if (item == 5) {
              orderedMinutes.push("05");
            } else orderedMinutes.push(item.toString());
          }
        }
        for (let item of minutes) {
          if (item < initMinutes) {
            if (item == 0) {
              orderedMinutes.push("00");
            } else if (item == 5) {
              orderedMinutes.push("05");
            } else orderedMinutes.push(item.toString());
          }
        }
        return orderedMinutes;
      } else
        return [
          "00",
          "05",
          "10",
          "15",
          "20",
          "25",
          "30",
          "35",
          "40",
          "45",
          "50",
          "55",
        ];
    },
    orderedMinutesNotEqual() {
      let cut = 12 * this.initialTimestampWidth;
      cut = 12 - cut;
      let fullString = [
        "00",
        "05",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
      ];
      return fullString.slice(cut);
    },
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
    if (this.timeBarStampsCount % 2 != 0) {
      this.initialTimestampWidth = this.timeBarStampsCount % 1;
      this.initialTimestampWidthString =
        (this.initialTimestampWidth * timeBarStampWidth).toString() + "vw";
    }
    this.timeBarWidth =
      (this.timeBarStampsCount * timeBarStampWidth).toString() + "vw";

    this.time = startTime;
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
  height: 4vh;
  font-size: 12px;
}

.time-bar p {
  margin: 0;
}

.time-bar-hour {
  background-color: rgb(196, 196, 196);
}

.one-hour,
.fractions {
  height: 2vh;
  border: 1px white ridge;
}

.fractions {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
}

.fractions p {
  text-align: center;
}
</style>
