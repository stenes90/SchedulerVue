<template>
  <div
    :class="'fraction ' + className"
    :data-dateId="dateId"
    :time="hour + ':' + minutes"
    :style="{ borderLeft: borderLeft, borderRight: borderRight }"
  >
    <p>{{ minutes }}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["index", "minutes", "hour", "dateId"],
  data() {
    return {
      className: "",
    };
  },

  computed: {
    ...mapState(["dragActive", "hoveredSlot"]),
    borderLeft() {
      if (this.index == 0) {
        return "none";
      } else return "1px white ridge";
    },
    borderRight() {
      if (this.index == 11) {
        return "none";
      } else return "1px white ridge";
    },
  },
  watch: {
    hoveredSlot() {
      // setTimeout(() => {
      //   if (this.hoveredSlot != null) {
      //     const searchTerm = `div.fraction[data-dateid="${this.hoveredSlot.DateId}"][time="${this.hoveredSlot.Time}"]`;
      //     const fraction = document.querySelector(searchTerm);
      //     // let fractions = document.querySelectorAll("div.fraction");
      //     // fractions = fractions.filter(
      //     //   (c) => c.getAttribute("data-dateid") == this.hoveredSlot.DateId
      //     // );
      //     // const fraction = fractions.find(
      //     //   (c) => c.getAttribute("time") == this.hoveredSlot.Time
      //     // );
      //     fraction.style.backgroundColor = "black";
      //   }
      // }, 100);
      // if (this.hoveredSlot != null) {
      //   console.log(this.hoveredSlot);
      //   debugger;
      //   if (
      //     this.dragActive &&
      //     this.hoveredSlot.DateId == this.dateId &&
      //     this.hoveredSlot.Hour == this.hour &&
      //     this.hoveredSlot.Minutes == this.minutes
      //   ) {
      //     this.className = "active";
      //   }
      // }
    },
  },
};
</script>

<style scoped>
p {
  text-align: center;
  margin: 0;
}

.active {
  background-color: black;
}
</style>
