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
