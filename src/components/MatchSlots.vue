<template>
  <div class="matches-container">
    <MatchSlot
      v-for="match in matchesForDateAndCourt"
      :key="match.Updater"
      :match="match"
    />
  </div>
</template>

<script>
import MatchSlot from "./MatchSlot.vue";
import { mapState } from "vuex";

export default {
  components: {
    MatchSlot,
  },
  props: ["date", "court"],
  data() {
    return {};
  },
  computed: {
    ...mapState(["matches"]),
    matchesForDateAndCourt() {
      return this.matches
        .filter((c) => c.PlayingDate.Id == this.date.Id)
        .filter((d) => d.CourtId == this.court.Id);
    },
  },

  // mounted() {
  //   console.log(this.matchesForDateAndCourt);
  //   debugger;
  // },
  // created() {
  //   this.matches = this.$store.getters["getMatches"];
  //   this.matches = this.matches
  //     .filter((c) => c.PlayingDate.Id == this.date.Id)
  //     .filter((d) => d.CourtId == this.court.Id);
  // },
};
</script>

<style>
.matches-container {
  position: absolute;
  height: 100%;
}
</style>
