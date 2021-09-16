<template>
  <div class="matches-container">
    <MatchSlot v-for="match in matches" :key="match.Id" :match="match" />
  </div>
</template>

<script>
import MatchSlot from "./MatchSlot.vue";
export default {
  components: {
    MatchSlot,
  },
  props: ["date", "court"],
  data() {
    return {
      matches: [],
    };
  },
  created() {
    this.matches = this.$store.getters["getMatches"];
    this.matches = this.matches
      .filter((c) => c.PlayingDate.Id == this.date.Id)
      .filter((d) => d.CourtId == this.court.Id);
  },
};
</script>

<style>
.matches-container {
  position: absolute;
  height: 100%;
}
</style>
