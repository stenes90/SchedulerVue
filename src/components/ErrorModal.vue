<template>
  <div>
    <div class="error">
      <p>
        Check console
      </p>
      <button @click="close">Close</button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    close() {
      this.$store.dispatch("setShowScheduleErrorModal", false);
    },
  },
};
</script>

<style scoped>
.error {
  width: 300px;
  height: 300px;
  background-color: white;
  border: 1px black solid;
  position: absolute;
  top: 150px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}
</style>
