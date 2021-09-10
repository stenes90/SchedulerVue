<template>
  <div
    v-show="displayed"
    class="timeslot"
    :data-slotId="slotId"
    :data-time="time"
    :data-index="index"
    :data-dateId="dateId"
    :data-courtId="courtId"
    :style="{ zIndex: zIndex, width: slotWidthString }"
  >
    {{ slotId }}
  </div>
</template>

<script>
export default {
  props: [
    "slotId",
    "slotWidthString",
    "zIndex",
    "time",
    "index",
    "dateId",
    "courtId",
    "displayed",
  ],
  created() {},
};
</script>
