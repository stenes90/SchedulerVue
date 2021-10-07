<template>
  <Timetable />
</template>

<script>
import Timetable from "./components/Timetable.vue";

export default {
  name: "App",
  components: {
    Timetable,
  },
  created() {
    let parent = document.createElement("div");
    parent.className = "roditel";
    parent.draggable = true;
    parent.style.position = "fixed";
    parent.style.top = 0 + "px";
    parent.style.left = 0 + "px";

    const body = document.querySelector("body");
    body.appendChild(parent);

    document.addEventListener("mousemove", (e) => {
      let left = e.clientX;
      let top = e.clientY;
      let parent = document.querySelector(".roditel");
      parent.style.left = left - 3 + "px";
      parent.style.top = top - 10 + "px";
    });
  },
};
</script>

<style></style>
