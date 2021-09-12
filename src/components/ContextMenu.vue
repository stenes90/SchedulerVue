<template>
  <div
    v-if="getShowContextMenu"
    :style="{ position: 'absolute', top: getYpos, left: getXpos, zIndex: '10' }"
    :class="className + 'cane'"
    @click="copyOrPaste"
  >
    <p>
      {{ menuType }}
    </p>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import scheduleMixin from "../Mixins/ScheduleMixin.vue";

export default {
  mixins: [scheduleMixin],
  data() {
    return {
      show: false,
      className: "",
    };
  },

  created() {},
  computed: {
    ...mapGetters([
      "getShowContextMenu",
      "getXpos",
      "getYpos",
      "getSelectedMatch",
      "getCoppiedMatch",
      "getSelectedTimeslot",
      "getisMatchCoppied",
    ]),
    // showMenu() {
    //   return this.$store.getters["getShowContextMenu"];
    // },

    menuType() {
      if (this.getSelectedMatch != null) {
        return "Copy Match";
      } else if (this.getSelectedTimeslot != null && this.getisMatchCoppied) {
        return "Paste match";
      } else return "";
    },
  },
  methods: {
    copyOrPaste() {
      if (this.getCoppiedMatch == null) {
        this.copyMatch(this.getSelectedMatch);
      } else if (this.getSelectedTimeslot != null && this.getisMatchCoppied) {
        this.pasteMatch(this.getSelectedTimeslot);
      } else return;
    },
  },
};
</script>

<style scoped>
p {
  text-align: center;
  background-color: white;
  min-width: 100px;
  min-height: 30px;
  border-radius: 5px;
  margin: 0;
}
</style>
