<template>
  <div
    :style="{ position: 'absolute', top: yPos, left: xPos, zIndex: '10' }"
    :class="menuType"
    onClick="{this.onCopyClick}"
  >
    Copy Match
  </div>
</template>

<script>
import scheduleMixin from "../Mixins/ScheduleMixin.vue";

export default {
  props: ["copy", "paste", "match", "timeslot"],
  mixins: [scheduleMixin],
  data() {
    return {};
  },
  created() {},
  computed: {
    menuType() {
      if (this.copy) {
        return "copyMeny";
      } else {
        return "pasteMenu";
      }
    },
  },
  copyPaste() {
    if (copy) {
      return;
    }
  },
};
</script>
