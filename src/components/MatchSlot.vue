<template>
  <div
    draggable="true"
    @dragstart="startDrag($event, match)"
    @dragend="endDrag($event, match)"
    class="match match-slot"
    :data-matchId="match.Id"
    :style="{
      left: matchPositionLeft,
      width: matchWidth,
      backgroundColor: color,
    }"
    @contextmenu="rightClick"
  >
    <div class="form-check form-check-inline">
      <input
        class="form-check-input"
        type="checkbox"
        @click="addToSelectedMatches"
        :checked="matchChecked"
      />
    </div>
    <p>{{ time }}</p>
    <p>Id: {{ match.Id }}</p>
    <p>Round: {{ match.Round }}</p>
  </div>
</template>

<script>
import moment from "moment";
import { extendMoment } from "moment-range";
import { mapGetters, mapState } from "vuex";
import scheduleMixin from "../Mixins/ScheduleMixin.vue";

export default {
  mixins: [scheduleMixin],
  props: ["match"],
  data() {
    return {
      classes: [],
      dragStarted: false,
      matchStartTime: "",
      dateStartTime: "",
      matchPositionLeft: "",
      matchWidth: "",
      colors: ["#034f84", "#c94c4c", "#50394c", "#b1cbbb", "#4040a1"],
    };
  },
  computed: {
    ...mapGetters(["getisMatchCoppied"]),
    ...mapState(["coppiedMatch", "courts"]),
    color() {
      let classs = this.classes.find((c) => c.Id == this.match.ClassId);
      let index = this.classes.indexOf(classs);
      return this.colors[index];
    },
    time() {
      return moment(this.matchStartTime).format("LT");
    },
    matchChecked() {
      return this.coppiedMatch.includes(this.match);
    },
  },

  created() {
    this.classes = this.$store.getters["getClasses"];

    this.matchStartTime = moment(this.match.StartTime);
    this.dateStartTime = moment(this.match.PlayingDate.StartTime);
    const timeSlotWidth = this.$store.getters["getFieldWidth"];
    let minutesFromStart = this.matchStartTime.diff(
      this.dateStartTime,
      "minutes"
    );
    this.matchPositionLeft =
      ((minutesFromStart / 5) * timeSlotWidth).toString() + "vw";
    this.matchWidth =
      (
        (parseInt(this.match.MatchDuration) / 5) *
        parseFloat(timeSlotWidth)
      ).toString() + "vw";
  },
  updated() {
    console.log(this.match);
  },

  methods: {
    // rightClick(e) {
    //   if (!this.getisMatchCoppied) {
    //     e.preventDefault();
    //     this.$store.dispatch("setShowContextMenu", true);
    //     this.$store.dispatch("setSelectedMatch", this.match);
    //     this.$store.dispatch("setXpos", e.pageX + "px");
    //     this.$store.dispatch("setYpos", e.pageY + "px");
    //   } else return;
    // },

    addToSelectedMatches() {
      let selectedMatchess = this.coppiedMatch;
      if (this.coppiedMatch.includes(this.match)) {
        selectedMatchess = selectedMatchess.filter(
          (c) => c.Id != this.match.Id
        );
      } else {
        selectedMatchess.push(this.match);
      }
      this.$store.dispatch("setCoppiedMatch", selectedMatchess);
      let kopiranite = this.$store.getters["getCoppiedMatch"];
      console.log(kopiranite);
    },

    startDrag(e, match) {
      console.log("drag start");

      console.log(e);

      e.dataTransfer.effectAllowed = "move";

      this.dragStarted = true;

      if (this.coppiedMatch.length == 1) {
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        const matchEl = document.querySelector(
          `div[data-matchId='${this.coppiedMatch[0].Id}']`
        );
        const parent = document.querySelector(".roditel");
        const coppiedMatchEl = matchEl.cloneNode(true);
        coppiedMatchEl.style.top = 0 + "px";
        coppiedMatchEl.style.left = 0 + "px";
        parent.appendChild(coppiedMatchEl);

        //e.dataTransfer.setData("firstMatch", this.coppiedMatch[0].Id);

        this.$store.dispatch("setIsMatchCoppied", true);
        console.log("coppied true");

        e.preventDefault();
        document.addEventListener("mouseup", (e) => {
          if (!this.dragStarted) {
            return;
          }
          if (e.target.className != "timeslot") {
            console.log("drop unsuccessful");
            this.$store.dispatch("setIsMatchCoppied", false);

            while (parent.firstChild) {
              parent.removeChild(parent.firstChild);
            }
          } else {
            const slotId = e.target.dataset.slotid;
            const timeFields = this.$store.getters["getTimeFields"];
            const slot = timeFields.find((c) => c.Id == slotId);
            this.onDrop(slot, this.coppiedMatch[0].Id);
            while (parent.firstChild) {
              parent.removeChild(parent.firstChild);
            }
          }
        });
      } else if (this.coppiedMatch.length > 1) {
        this.$store.dispatch("setIsMatchCoppied", true);

        // let parent = document.createElement("div");
        // parent.className = "roditel";
        // parent.draggable = true;
        // parent.style.position = "fixed";
        // const body = document.querySelector("body");
        // body.appendChild(parent);
        const parent = document.querySelector(".roditel");

        let timefieldIdsForSelectedMatches = [];
        let timefieldsForSelectedMatches = [];

        for (let match of this.coppiedMatch) {
          for (let field of match.TimeFields) {
            timefieldIdsForSelectedMatches.push(field.DateIndex);
            timefieldsForSelectedMatches.push(field);
          }
        }
        let smallestFieldId = Math.min(...timefieldIdsForSelectedMatches);
        let smallestFields = timefieldsForSelectedMatches.filter(
          (c) => c.DateIndex == smallestFieldId
        );
        let smallestField = smallestFields[0];
        if (smallestFields.length > 1) {
          for (let item of smallestFields) {
            if (item.Id < smallestField.Id) {
              smallestField = item;
            }
          }
        }
        let firstMatch = this.coppiedMatch.find((c) =>
          c.TimeFields.includes(smallestField)
        );

        //e.dataTransfer.setData("firstMatch", firstMatch.Id);

        let courtForFirstMatch = this.courts.find(
          (c) => c.Id == firstMatch.CourtId
        );
        let ind = this.courts.indexOf(courtForFirstMatch);

        const courtIndexesForSelectedMatches = [];
        for (let item of this.coppiedMatch) {
          let court = this.courts.find((c) => c.Id == item.CourtId);
          let ind = this.courts.indexOf(court);

          courtIndexesForSelectedMatches.push(ind);
        }
        let smallestCourtIndex = Math.min(...courtIndexesForSelectedMatches);

        // let courtsUp = ind - smallestCourtIndex;
        let courtsUp = ind;
        let firstMatchDiv = document.querySelector(
          `div[data-matchid='${firstMatch.Id}']`
        );
        let left = firstMatchDiv.style.left;
        left = left.slice(0, left.length - 2);
        left = parseFloat(left);

        const matches = this.$store.getters["getMatches"];
        const matchesForDate = matches.filter(
          (c) => c.PlayingDate.Id == this.coppiedMatch[0].PlayingDate.Id
        );
        for (let item of matchesForDate) {
          const matchEl = document.querySelector(
            `div[data-matchId='${item.Id}']`
          );
          const coppiedMatchEl = matchEl.cloneNode(true);
          coppiedMatchEl.draggable = false;
          if (!this.coppiedMatch.includes(item)) {
            coppiedMatchEl.style.opacity = "0";
          } else {
            let firstMatchDiv = document.querySelector(
              `div[data-matchid='${firstMatch.Id}']`
            );
            const courtId = item.CourtId;
            const court = this.courts.find((c) => c.Id == courtId);
            let index = this.courts.indexOf(court);
            let top = 10 * index;
            top = top - courtsUp * 10;
            const topString = top.toString() + "vh";
            coppiedMatchEl.style.top = topString;
            let coppiedLeft = coppiedMatchEl.style.left;
            coppiedLeft = coppiedLeft.slice(0, coppiedLeft.length - 2);
            coppiedLeft = parseFloat(coppiedLeft);
            const newLeft = (coppiedLeft - left).toString() + "vw";
            coppiedMatchEl.style.left = newLeft;

            parent.appendChild(coppiedMatchEl);
          }
        }
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        e.preventDefault();
        document.addEventListener("mouseup", (e) => {
          if (!this.dragStarted) {
            return;
          }
          if (e.target.className != "timeslot") {
            console.log("drop unsuccessful");
            this.$store.dispatch("setIsMatchCoppied", false);

            while (parent.firstChild) {
              parent.removeChild(parent.firstChild);
            }
          } else {
            const slotId = e.target.dataset.slotid;
            const timeFields = this.$store.getters["getTimeFields"];
            const slot = timeFields.find((c) => c.Id == slotId);
            this.onDrop(slot, firstMatch.Id);
            while (parent.firstChild) {
              parent.removeChild(parent.firstChild);
            }
          }
        });
      }
    },
    // drag(e) {
    //   console.log(e);
    // },
    onDrop(slot, firstMatchId) {
      console.log("dropped");
      this.pasteMatch(slot, firstMatchId);
      this.dragStarted = false;
    },
    // endDrag(e, match) {
    //   console.log("drag end");
    //   console.log(e);

    //   if (e.dataTransfer.dropEffect == "none") {
    //     this.$store.dispatch("setIsMatchCoppied", false);
    //   } else {
    //     this.$store.dispatch("setIsMatchCoppied", false);
    //     this.$store.dispatch("setCoppiedMatch", []);
    //     //this.$store.dispatch("setSelectedMatch", []);
    //   }
    //   while (parent.firstChild) {
    //     parent.removeChild(parent.firstChild);
    //   }
    // setTimeout(() => {
    //   let parent = document.querySelector(".roditel");
    //   parent.remove();
    // }, 10);
    // this.$store.dispatch("setIsMatchCoppied", false);
    // this.$store.dispatch("setCoppiedMatch", null);
    //},
  },
};
</script>

<style scoped>
.match {
  position: absolute;

  top: 0;
  border: 1px black solid;
  height: 10vh;
}

.match input:hover {
  cursor: pointer;
}

.match:hover {
  cursor: grab;
}

.match p {
  color: white;
  font-size: 10px;
  margin: 0;
}
</style>
