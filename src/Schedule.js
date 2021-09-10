import Moment from "moment";
import { extendMoment } from "moment-range";

const schedule = (tournament) => {
  const moment = extendMoment(Moment);
  let matches = tournament.Matches;

  for (let i = 0; i < matches.length; i++) {
    matches[i].Id = i + 1;
  }

  let scheduledMatches = matches.filter((c) => c.IsScheduled == true);
  let notScheduledMatches = matches.filter((c) => c.IsScheduled == false);

  let listOfScheduledMatches = [];

  for (let actualDate of tournament.PlayingDates) {
    scheduledMatches = matches.filter((c) => c.IsScheduled == true);
    notScheduledMatches = matches.filter((c) => c.IsScheduled == false);
    let listOfCourts = actualDate.Courts;
    let endTime = actualDate.EndTime;
    let matchIndex = 0;

    for (let match of notScheduledMatches) {
      matchIndex++;
      let matchClass = tournament.Classes.find((c) => c.Id == match.ClassId);
      const start = new Date(0, 0, 0, 0, 0, 0);
      const end = new Date(0, 0, 0, 0, 0, 0);

      const timeRange = moment.range(start, end);
      match.TimeRange = timeRange;
      match.matchScheduleIndex = matchIndex;
      let nextAvailableTimeForClassMatch = "";
      try {
        let lastScheduledMatches = listOfScheduledMatches.filter(
          (c) => c.Round == match.Round - 1
        );
        lastScheduledMatches = lastScheduledMatches.filter(
          (x) => x.ClassId == match.ClassId
        );
        lastScheduledMatches = lastScheduledMatches.filter(
          (z) => z.PlayingDate.Id == actualDate.Id
        );
        let lastScheduledMatchForClass =
          lastScheduledMatches[lastScheduledMatches.length - 1];
        nextAvailableTimeForClassMatch = moment(
          lastScheduledMatchForClass.EndTime
        ).add(matchClass.BreakBetweenMatches, "m");
      } catch {
        console.log("catched");
      }
      var listOfStartTimesForEachCourt = [];
      for (let court of actualDate.Courts) {
        let start = new Date(actualDate.StartTime);
        start = moment(start)
          .add(1, "m")
          .toDate();
        let end = moment(start)
          .add(1, "s")
          .toDate();

        let checkTime = moment.range(start, end);
        let scheduledMatchesForCourt = matches.filter(
          (c) => c.CourtId == court.Id
        );
        scheduledMatchesForCourt = scheduledMatchesForCourt.filter(
          (x) => x.IsScheduled
        );
        scheduledMatchesForCourt = scheduledMatchesForCourt.filter(
          (z) => z.PlayingDate == actualDate
        );
        let listOfMatchTimeRangesForCourt = [];
        for (let item of scheduledMatchesForCourt) {
          listOfMatchTimeRangesForCourt.push(
            moment.range(item.StartTime, item.EndTime)
          );
        }

        while (checkTime.end < moment(actualDate.EndTime)) {
          if (scheduledMatchesForCourt.length == 0) {
            match.StartTime = moment(actualDate.StartTime);
            listOfStartTimesForEachCourt.push(match.StartTime);
            break;
          } else {
            let overlap = false;
            for (let i = 0; i < listOfMatchTimeRangesForCourt.length; i++) {
              let checkTimeRangeIntersectWithScheduledMatch = listOfMatchTimeRangesForCourt[
                i
              ].intersect(checkTime);
              if (checkTimeRangeIntersectWithScheduledMatch) {
                overlap = true;
                break;
              }
            }

            if (overlap || checkTime.start < nextAvailableTimeForClassMatch) {
              checkTime.end = moment(checkTime.end).add(5, "m");
              checkTime.start = moment(checkTime.start).add(5, "m");
            } else {
              match.StartTime = checkTime.start.add(-1, "m");
              listOfStartTimesForEachCourt.push(match.StartTime);
              break;
            }
          }
        }
      }
      if (listOfStartTimesForEachCourt == 0) {
        break;
      }

      // let smallestDate = Math.min(listOfStartTimesForEachCourt);
      let smallestDate = moment.min(listOfStartTimesForEachCourt);
      let indexOfSmallest = listOfStartTimesForEachCourt.indexOf(smallestDate);
      match.CourtId = listOfCourts[indexOfSmallest].Id;
      match.PlayingDate = actualDate;
      match.StartTime = smallestDate.format();
      match.EndTime = moment(match.StartTime)
        .add(matchClass.MatchDuration, "m")
        .format();
      match.MatchDuration = matchClass.MatchDuration;
      match.IsScheduled = true;
      match.TimeRange = moment.range(match.StartTime, match.EndTime);
      listOfScheduledMatches.push(match);
    }
  }
  console.log(matches[3].TimeRange.start.format());
  return matches;
};

export default schedule;
