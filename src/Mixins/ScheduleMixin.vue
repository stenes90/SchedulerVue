<script>
import tournament from "../../tournament.json";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { mapState } from "vuex";
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
      //let match = { ...coppiedMatch };
      // let match = state.tournament.matches.find(
      //   (m) => m.id == state.coppiedMatch.id
      // );
      coppiedMatch.StartTime = startTime;
      coppiedMatch.EndTime = endTime;
      coppiedMatch.PlayingDate = date;
      coppiedMatch.CourtId = courtId;
      coppiedMatch.TimeRange = range;
      coppiedMatch.TimeFields = [];
      coppiedMatch.Updater = coppiedMatch.Updater + 1000;

      timeFields
        .filter((d) => d.DateId == coppiedMatch.PlayingDate.Id)
        .filter((c) => c.CourtId == coppiedMatch.CourtId)
        .forEach((timeField) => {
          if (timeField.Range.intersect(coppiedMatch.TimeRange)) {
            coppiedMatch.TimeFields.push(timeField);
          }
        });

      coppiedMatchFields.forEach((item) => {
        let field = timeFields.find((c) => c.Id == item.Id);
        field.Empty = true;
      });

      const matchesForCourt = matches.filter(
        (m) => m.CourtId == initialField.CourtId
      );

      const firstIntersectedMatch = this.FirstIntersectedMatch(
        coppiedMatch,
        matchesForCourt
      );
      let movement = 0;
      if (firstIntersectedMatch) {
        movement = this.Movement(firstIntersectedMatch, coppiedMatch);
      }
      if (firstIntersectedMatch) {
        for (let i = matchesForCourt.length - 1; i >= 0; i--) {
          let match = matchesForCourt[i];
          if (match.Id == coppiedMatch.Id) {
            continue;
          }
          let emptyFields = timeFields
            .filter((d) => d.DateId == match.PlayingDate.Id)
            .filter((c) => c.CourtId == match.CourtId)
            .filter((e) => e.Empty == true)
            .filter((f) => f.Id < match.TimeFields[0].Id)
            .filter(
              (g) =>
                g.Id >
                firstIntersectedMatch.TimeFields[
                  firstIntersectedMatch.TimeFields.length - 1
                ].Id
            );
          if (
            emptyFields.length < movement &&
            match.TimeFields[0].Id >= firstIntersectedMatch.TimeFields[0].Id
          ) {
            let moveMinutes = (movement - emptyFields.length) * 5;
            let startTime = new Date(match.StartTime);
            startTime = new Date(startTime.getTime() + moveMinutes * 60000);
            let endTime = new Date(match.EndTime);
            endTime = new Date(endTime.getTime() + moveMinutes * 60000);
            const range = moment.range(startTime, endTime);
            match.StartTime = startTime;
            match.EndTime = endTime;
            match.TimeRange = range;
            match.Updater = match.Updater + 1000;
          }
        }
      }

      matchesForCourt.forEach((match) => {
        match.TimeFields = [];
        const timeFieldsForDateAndCourt = timeFields
          .filter((d) => d.DateId == match.PlayingDate.Id)
          .filter((c) => c.CourtId == match.CourtId);
        timeFieldsForDateAndCourt.forEach((timeField) => {
          if (timeField.Range.intersect(match.TimeRange)) {
            match.TimeFields.push(timeField);
          }
        });
      });

      const busyTimeFields = [];
      matchesForCourt.forEach((match) => {
        busyTimeFields.push(...match.TimeFields);
      });
      const timeFieldsForCourt = timeFields
        .filter((c) => c.CourtId == coppiedMatch.CourtId)
        .filter((d) => d.DateId == coppiedMatch.PlayingDate.Id);
      for (let field of timeFieldsForCourt) {
        if (busyTimeFields.includes(field)) {
          field.Empty = false;
        } else {
          field.Empty = true;
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
      console.log(matches);
      //this.$store.dispatch("setMatches", matches);
      this.$store.dispatch("setIsMatchCoppied", false);
      this.$store.dispatch("setCoppiedMatch", null);
      this.$store.dispatch("setShowContextMenu", false);
      this.$store.dispatch("setSelectedMatch", null);
      console.log("pasted at timeslot");
    },

    FirstIntersectedMatch(coppiedMatch, matchesForCourt) {
      let intersectedMatches = [];
      let firstIntersectedMatch = null;
      for (let match of matchesForCourt) {
        if (match.Id == coppiedMatch.Id) {
          continue;
        }
        if (match.TimeRange.intersect(coppiedMatch.TimeRange)) {
          intersectedMatches.push(match);
        }
      }
      //timefields for intersected matches
      let timefields = [];
      for (let item of intersectedMatches) {
        for (let field of item.TimeFields) {
          timefields.push(field);
        }
      }

      if (timefields.length > 0) {
        const smallestTimeFieldId = Math.min.apply(
          null,
          timefields.map((item) => item.Id)
        );
        const smallestTimeField = timefields.find(
          (c) => c.Id == smallestTimeFieldId
        );
        //Math.min.apply(null, timefields.map(item => item.Id))
        firstIntersectedMatch = intersectedMatches.find((t) =>
          t.TimeFields.includes(smallestTimeField)
        );
      }
      return firstIntersectedMatch;
    },

    Movement(intersectedMatch, coppiedMatch) {
      let movement = 0;
      const matchTimeFieldsCount = intersectedMatch.TimeFields.length;
      if (coppiedMatch.TimeFields[0].Id < intersectedMatch.TimeFields[0].Id) {
        movement =
          coppiedMatch.TimeFields[coppiedMatch.TimeFields.length - 1].Id -
          intersectedMatch.TimeFields[0].Id +
          1;
      } else if (
        coppiedMatch.TimeFields[0].Id == intersectedMatch.TimeFields[0].Id
      ) {
        movement = coppiedMatch.TimeFields.length;
      } else {
        movement =
          coppiedMatch.TimeFields[coppiedMatch.TimeFields.length - 1].Id -
          intersectedMatch.TimeFields[intersectedMatch.TimeFields.length - 1]
            .Id +
          intersectedMatch.TimeFields.length;
      }
      return movement;
    },
  },
};
</script>
