import instadate from 'instadate';
import moment from 'moment';

export function recomputeTimes(
  task,
  startTime,
  endTime,
  startDate,
  endDate,
  estimatedMinutes,
  editingStartTime = true
) {
  startDate = startDate
    ? instadate.noon(new Date(startDate))
    : task.computedStartDate;
  endDate = endDate ? instadate.noon(new Date(endDate)) : task.computedEndDate;
  startTime = startTime ?? task.start_time;
  endTime = endTime ?? task.end_time;
  estimatedMinutes =
    estimatedMinutes ??
    getAdjustedDailyEstimate(
      startDate,
      endDate,
      task.estimated_minutes,
      task.estimate_type
    );
  const currentTime = editingStartTime ? startTime : endTime;

  // ------------------------------------------------------
  // Clear editors when value is null
  // ------------------------------------------------------
  const shouldResetTimes =
    !currentTime || !moment(currentTime, 'HH:mm').isValid();

  if (shouldResetTimes) {
    return { startTime, endTime };
  }

  // ------------------------------------------------------
  // Recalculate times if estimated minutes is set
  // ------------------------------------------------------
  if (estimatedMinutes) {
    if (editingStartTime) {
      endTime = getAdjustedTime(startTime, estimatedMinutes);
    } else {
      startTime = getAdjustedTime(endTime, estimatedMinutes * -1);
    }

    return { startTime, endTime };
  }

  // ------------------------------------------------------
  // For 1 day tasks, ensure start time is before end time
  // ------------------------------------------------------

  const isSameDay = instadate.isSameDay(startDate, endDate);
  const shouldUpdate = editingStartTime
    ? !!endTime
    : !!startTime && !!endTime && startTime > endTime;

  if (isSameDay && shouldUpdate) {
    if (editingStartTime) {
      endTime = getAdjustedTime(startTime, 1, 'hour');
    } else {
      startTime = getAdjustedTime(endTime, -1, 'hour');
    }

    return { startTime, endTime };
  }

  return;
}

export function getAdjustedTime(time, adjustBy, unit = 'minutes') {
  return moment
    .utc(time, 'HH:mm')
    .add(adjustBy, unit)
    .format('HH:mm');
}

export function getAdjustedDailyEstimate(
  startDate,
  endDate,
  estimatedMinutes,
  estimateType
) {
  if (estimateType === 'daily' || !startDate || !endDate) {
    return estimatedMinutes;
  }

  const lengthInDays = instadate.differenceInDays(startDate, endDate) + 1;

  return Math.round(estimatedMinutes / lengthInDays);
}
