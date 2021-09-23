<template>
  <div
    draggable="true"
    @dragstart="startDrag($event, match)"
    @drag="drag($event)"
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
      />
    </div>
    <p>{{ time }}</p>
    <p>{{ match.Id }}</p>
  </div>
</template>

<script>
import moment from "moment";
import { extendMoment } from "moment-range";
import { mapGetters, mapState } from "vuex";

export default {
  props: ["match"],
  data() {
    return {
      classes: [],
      matchStartTime: "",
      dateStartTime: "",
      matchPositionLeft: "",
      matchWidth: "",
      colors: ["#034f84", "#c94c4c", "#50394c", "#b1cbbb", "#4040a1"],
      selectedMatches: [],
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
  },

  created() {
    console.log("created");
    this.classes = this.$store.getters["getClasses"];
    this.selectedMatches = this.$store.getters["getSelectedMatch"];
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
    console.log("updated");
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
      if (this.selectedMatches.includes(this.match)) {
        this.selectedMatches = this.selectedMatches.filter(
          (c) => c.Id != this.match.Id
        );
      } else {
        this.selectedMatches.push(this.match);
      }
      this.$store.dispatch("setCoppiedMatch", this.selectedMatches);
      let kopiranite = this.$store.getters["getCoppiedMatch"];
      console.log(kopiranite);
    },

    startDrag(e, match) {
      console.log("drag start");
      console.log(e);
      if (this.coppiedMatch.length == 1) {
        const ghost = e.srcElement;
        e.dataTransfer.setDragImage(ghost, 5, 50);

        setTimeout(() => {
          this.$store.dispatch("setIsMatchCoppied", true);
        }, 10);
      } else if (this.coppiedMatch.length > 1) {
        // let courtIdForFirstSelectedMatch = null;
        // for (let court of this.courts) {
        //   if (courtIdForFirstSelectedMatch != null) {
        //     break;
        //   }
        //   for (let item of this.coppiedMatch) {
        //     if (item.CourtId == court.Id) {
        //       courtIdForFirstSelectedMatch = item.CourtId;
        //       break;
        //     }
        //   }
        // }
        // console.log(courtIdForFirstSelectedMatch);
        // const selectedMatchesForCourt = this.selectedMatches.filter(
        //   (c) => c.CourtId == courtIdForFirstSelectedMatch
        // );
        // for (let item of selectedMatchesForCourt) {
        //   item.StartTime = new Date(item.StartTime);
        // }
        // const sortedSelectedMatchesForCourt = selectedMatchesForCourt.sort(
        //   (a, b) => a.StartTime - b.StartTime
        // );
        // let firstMatch = sortedSelectedMatchesForCourt[0];

        // let parent = document.createElement("div");
        // parent.className = "roditel";
        // parent.draggable = true;
        // parent.style.position = "fixed";
        // const body = document.querySelector("body");
        // body.appendChild(parent);

        let parent = document.createElement("div");
        parent.className = "roditel";
        parent.draggable = true;
        parent.style.position = "fixed";
        const body = document.querySelector("body");
        body.appendChild(parent);

        this.$store.dispatch("setShowContextMenu", true);

        // let relativeMatch = document.querySelector(
        //   `div[data-matchId='${firstMatch.Id}']`
        // );
        // for (let item of this.selectedMatches) {
        //   item.StartTime = new Date(item.StartTime);
        // }
        // const sortedSelectedMatches = this.selectedMatches.sort(
        //   (a, b) => a.StartTime - b.StartTime
        // );
        // let date = sortedSelectedMatches[0].StartTime;
        // let matchesWithSameDate = [];
        // for (let item of this.selectedMatches) {
        //   if (item.StartTime == date) {
        //     matchesWithSameDate.push(item);
        //   }
        // }
        // let smallestIndexes = [];
        // for (let item of matchesWithSameDate) {
        //   let court = this.courts.find((c) => c.Id == item.CourtId);
        //   let ind = this.courts.indexOf(court);
        //   smallestIndexes.push(ind);
        // }

        // let smallestIndex = Math.min(smallestIndexes);
        // let index = smallestIndexes.indexOf(smallestIndex);
        // firstMatch = matchesWithSameDate[index];

        // let courtForFirstMatch = this.courts.find(
        //   (c) => c.Id == firstMatch.CourtId
        // );
        // console.log(courtForFirstMatch);
        // let ind = this.courts.indexOf(courtForFirstMatch);
        let timefieldIdsForSelectedMatches = [];
        let timefieldsForSelectedMatches = [];

        for (let match of this.selectedMatches) {
          for (let field of match.TimeFields) {
            timefieldIdsForSelectedMatches.push(field.Index);
            timefieldsForSelectedMatches.push(field);
          }
        }
        let smallestFieldId = Math.min(...timefieldIdsForSelectedMatches);
        let smallestFields = timefieldsForSelectedMatches.filter(
          (c) => c.Index == smallestFieldId
        );
        let smallestField = smallestFields[0];
        if (smallestFields.length > 1) {
          for (let item of smallestFields) {
            if (item.Id < smallestField.Id) {
              smallestField = item;
            }
          }
        }
        let firstMatch = this.selectedMatches.find((c) =>
          c.TimeFields.includes(smallestField)
        );

        let courtForFirstMatch = this.courts.find(
          (c) => c.Id == firstMatch.CourtId
        );
        let ind = this.courts.indexOf(courtForFirstMatch);

        const courtIndexesForSelectedMatches = [];
        for (let item of this.selectedMatches) {
          let court = this.courts.find((c) => c.Id == item.CourtId);
          let ind = this.courts.indexOf(court);

          courtIndexesForSelectedMatches.push(ind);
        }
        let smallestCourtIndex = Math.min(...courtIndexesForSelectedMatches);

        // let courtsUp = ind - smallestCourtIndex;
        let courtsUp = ind;
        console.log(courtIndexesForSelectedMatches);
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
            debugger;
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
        let img = new Image();
        e.dataTransfer.setDragImage(new Image(), 5, 50);

        console.log(parent);

        // document.addEventListener("mousemove", function(e) {
        //   let left = e.clientX;
        //   let top = e.clientY;
        //   let parent = document.querySelector(".roditel");
        //   parent.style.left = left + "px";
        //   parent.style.top = top + "px";
        //   console.log(e);
        //   console.log(parent);
        //   console.log("c");
        // });

        // for (let item of this.selectedMatches) {
        //   const el = document.querySelector(`div[data-matchId='${item.Id}']`);
        //   const copy = el.cloneNode(true);
        //   copy.draggable = false;
        //   parent.appendChild(copy);
        // }
        // parent.draggable = true;
        // parent.style.height = "100vh";
        // parent.style.width = "100 vw";
        // parent.style.backgroundColor = "white";
        // let ghostsDiv = document.querySelector(".ghosts");
        // ghostsDiv.appendChild(parent);
        // console.log(parent);
        // e.dataTransfer.setDragImage(parent, 5, 50);
        // setTimeout(() => {
        //   ghostsDiv.removeChild(parent);
        //   console.log("after timeout");
        // }, 15000);
        // console.log("gangam");
      }
      // this.$store.dispatch("setCoppiedMatch", match);
    },
    drag(e) {
      let left = e.clientX;
      let top = e.clientY;
      let parent = document.querySelector(".roditel");
      parent.style.left = left + "px";
      parent.style.top = top + "px";
    },
    endDrag(e, match) {
      console.log("drag end");
      this.$store.dispatch("setIsMatchCoppied", false);
      this.$store.dispatch("setCoppiedMatch", null);
    },
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

.match p {
  color: white;
  font-size: 10px;
  margin: 0;
}
</style>
