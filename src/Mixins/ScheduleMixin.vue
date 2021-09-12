<script>
import tournament from "../../tournament.json";
import Moment from "moment";
import { extendMoment } from "moment-range";
export default {
  methods: {
    timeFieldWidth(classes) {
      // CALCULATING TIMEFIELD WIDTH START
      let matchDurations = [];
      classes.forEach((classs) => {
        matchDurations.push(parseInt(classs.MatchDuration));
      });
      const smallestMatchDuration = Math.min(...matchDurations);
      // number of 5min fields that covers the smallest match
      const smallestMatchDurationTimeFieldsCount = smallestMatchDuration / 5;
      //Initial Grid should be able to fill 12 matches with minimum duration
      //In 100vw it should fill 12 x "smallestMatchDurationTimeFieldsCount"
      const totalTimeFieldsPerVW = 12 * smallestMatchDurationTimeFieldsCount;
      // In 100vw we show always 5vw for the name of court and 95vw for 15 matches with smallest duration
      const timeFieldWidth = 95 / totalTimeFieldsPerVW;
      // CALCULATING TIMEFIELD WIDTH END
      return timeFieldWidth;
    },

    timeFields(dates, matches) {
      const timeSlots = [];
      const moment = extendMoment(Moment);
      let counter = 0;
      //dates.forEach((date) => {
      for (let date of dates) {
        const dateCourts = date.Courts;
        dateCourts.forEach((court) => {
          const startTime = moment(date.StartTime);
          const endtTime = moment(startTime).add(1, "day");
          // endtTime.setDate(startTime.getDate() + 1);
          // endtTime.setHours(0, 0, 0);

          let initialTime = new Date(date.StartTime);
          initialTime.setHours(0, 0, 0);
          initialTime = moment(initialTime);

          for (let i = 0; i < 288; i++) {
            const start = initialTime;
            const end = moment(start);
            end.add(5, "m");
            const range = moment.range(start, end);
            const displayed = start < startTime ? false : true;
            let empty = true;
            matchesLoop: for (let match of matches) {
              if (range.intersect(match.TimeRange)) {
                empty = false;
                break matchesLoop;
              }
            }
            timeSlots.push({
              Id: counter,
              Time: initialTime.format(),
              Index: counter,
              DateId: date.Id,
              CourtId: court.Id,
              Range: range,
              Displayed: displayed,
              Empty: empty,
            });
            initialTime.add(5, "m");
            counter++;
          }
        });
      }
      return timeSlots;
    },

    copyMatch(match) {
      this.$store.dispatch("setIsMatchCoppied", true);
      this.$store.dispatch("setCoppiedMatch", match);
      this.$store.dispatch("setSelectedMatch", null);
      this.$store.dispatch("setShowContextMenu", false);
    },
    pasteMatch(timeSlot) {
      debugger;
      const moment = extendMoment(Moment);
      let coppiedMatch = this.$store.getters["getCoppiedMatch"];
      let playingDates = this.$store.getters["playingDates"];
      let matches = this.$store.getters["getMatches"];
      let timeFields = this.$store.getters["getTimeFields"];

      const coppiedMatchFields = coppiedMatch.TimeFields;
      const initialField = timeFields.find((f) => f.Id == timeSlot.Id);
      const startTime = new Date(initialField.Time);
      const matchDuration = coppiedMatch.MatchDuration;
      const endTime = new Date(startTime.getTime() + matchDuration * 60000);
      const range = moment.range(startTime, endTime);
      const date = playingDates.find((d) => d.Id == initialField.DateId);

      const courtId = initialField.CourtId;
      let tn = null; //need to be improved
      let match = { ...coppiedMatch };
      // let match = state.tournament.matches.find(
      //   (m) => m.id == state.coppiedMatch.id
      // );
      match.StartTime = startTime;
      match.EndTime = endTime;
      match.PlayingDate = date;
      match.CourtId = courtId;
      match.Range = range;
      match.TimeFields = [];

      let checkfields = timeFields.filter(
        (d) => d.DateId == match.PlayingDate.Id
      );
      let checkfields2 = checkfields.filter((c) => c.CourtId == match.CourtId);
      timeFields
        .filter((d) => d.DateId == match.PlayingDate.Id)
        .filter((c) => c.CourtId == match.CourtId)
        .forEach((timeField) => {
          if (timeField.Range.intersect(match.Range)) {
            match.TimeFields.push(timeField);
          }
        });

      coppiedMatchFields.forEach((item) => {
        let field = timeFields.find((c) => c.Id == item.Id);
        debugger;
        field.Empty = true;
      });

      const matchesForCourt = matches.filter(
        (m) => m.courtId == initialField.courtId
      );

      const firstIntersectedMatch = this.FirstIntersectedMatch(
        match,
        matchesForCourt
      );
      let movement = 0;
      if (firstIntersectedMatch) {
        movement = this.Movement(firstIntersectedMatch, match);
      }
      if (firstIntersectedMatch) {
        for (let i = matchesForCourt.length - 1; i >= 0; i--) {
          let match = matchesForCourt[i];
          if (match.id == coppiedMatch.id) {
            continue;
          }
          let emptyFields = timeFields
            .filter((d) => d.dateId == match.playingDate.id)
            .filter((c) => c.courtId == match.courtId)
            .filter((e) => e.empty == true)
            .filter((f) => f.id < match.timeFields[0])
            .filter(
              (g) =>
                g.id >
                firstIntersectedMatch.timeFields[
                  firstIntersectedMatch.timeFields.length - 1
                ]
            );
          if (
            emptyFields.length < movement &&
            match.timeFields[0] >= firstIntersectedMatch.timeFields[0]
          ) {
            let moveMinutes = (movement - emptyFields.length) * 5;
            let startTime = new Date(match.startTime);
            startTime = new Date(startTime.getTime() + moveMinutes * 60000);
            let endTime = new Date(match.endTime);
            endTime = new Date(endTime.getTime() + moveMinutes * 60000);
            const range = moment.range(startTime, endTime);
            match.startTime = startTime;
            match.endTime = endTime;
            match.range = range;
          }
        }
      }

      matchesForCourt.forEach((match) => {
        match.timeFields = [];
        timeFields
          .filter((d) => d.dateId == match.playingDate.id)
          .filter((c) => c.courtId == match.courtId)
          .forEach((timeField) => {
            if (timeField.range.intersect(match.range)) {
              match.timeFields.push(timeField.id);
            }
          });
      });

      const busyTimeFields = [];
      matchesForCourt.forEach((match) => {
        busyTimeFields.push(...match.timeFields);
      });

      const timeFieldsForCourt = timeFields
        .filter((c) => c.courtId == coppiedMatch.courtId)
        .filter((d) => d.dateId == coppiedMatch.playingDate.id);
      for (let field of timeFieldsForCourt) {
        if (busyTimeFields.includes(field.id)) {
          field.empty = false;
        } else {
          field.empty = true;
        }
      }

      // let versions = state.versions.filter((c) => c.id <= state.activeVersion);
      // let verId = versions.length;
      // var _ = require("lodash");
      // let ver = _.cloneDeep({
      //   timeFields: timeFields,
      //   tournament: tn,
      //   id: verId,
      // });

      // versions.push(ver);

      // state.setTimetableState({
      //   tournament: tn,
      //   isMatchCoppied: false,
      //   coppiedMatch: null,
      //   versions: versions,
      //   activeVersion: verId,
      //   coppiedMatch: null,
      //   isMatchCoppied: false,
      // });

      this.$store.dispatch("setIsMatchCoppied", false);
      this.$store.dispatch("setCoppiedMatch", null);
      this.$store.dispatch("setShowContextMenu", false);
      this.$store.dispatch("setSelectedMatch", null);
      console.log("pasted at timeslot");
      console.log(timeSlot);
    },

    FirstIntersectedMatch(coppiedMatch, matchesForCourt) {
      let intersectedMatches = [];
      let firstIntersectedMatch = null;
      for (let match of matchesForCourt) {
        if (match.id == coppiedMatch.id) {
          continue;
        }
        if (match.range.intersect(coppiedMatch.range)) {
          intersectedMatches.push(match);
        }
      }
      //timefields for intersected matches
      let timefields = [];
      for (let item of intersectedMatches) {
        for (let field of item.timeFields) {
          timefields.push(field);
        }
      }

      if (timefields.length > 0) {
        const smallestTimeField = Math.min(...timefields);
        firstIntersectedMatch = intersectedMatches.find((t) =>
          t.timeFields.includes(smallestTimeField)
        );
      }
      return firstIntersectedMatch;
    },

    Movement(intersectedMatch, coppiedMatch) {
      let movement = 0;
      const matchTimeFieldsCount = intersectedMatch.timeFields.length;
      if (coppiedMatch.timeFields[0] < intersectedMatch.timeFields[0]) {
        movement =
          coppiedMatch.timeFields[coppiedMatch.timeFields.length - 1] -
          intersectedMatch.timeFields[0] +
          1;
      } else if (coppiedMatch.timeFields[0] == intersectedMatch.timeFields[0]) {
        movement = coppiedMatch.timeFields.length;
      } else {
        movement =
          coppiedMatch.timeFields[coppiedMatch.timeFields.length - 1] -
          intersectedMatch.timeFields[intersectedMatch.timeFields.length - 1] +
          intersectedMatch.timeFields.length;
      }
      return movement;
    },
  },
};
</script>
