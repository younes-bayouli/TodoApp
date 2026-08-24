export function format(date) {
  const d = date;

  const hour24 = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const hour12 = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return { hour24, hour12 };
}

export function timeToMinutes(time) {
  return time.getHours() * 60 + time.getMinutes();
}

export function stringToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}


export function minutesToString(minutes){
  `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

export function timeDifferenceInMinutes(start, end) {
  return stringToMinutes(end) - stringToMinutes(start);
}

export function compareTime(t1,t2){
  if(timeDifferenceInMinutes(t2,t1)<0){
    return -1;
  }
  return timeDifferenceInMinutes(t2,t1)>0;
}

export function intersectionTimes(aStart, aEnd, bStart, bEnd) {
    aStart=stringToMinutes(aStart)
    aEnd=stringToMinutes(aEnd)
    bStart=stringToMinutes(bStart)
    bEnd=stringToMinutes(bEnd)

    const start = Math.max(aStart, bStart);
    const end = Math.min(aEnd, bEnd);

    return start < end ? [start, end] : null;
}

export function checkOverLap(start1,end1,start2,end2){
  let intersection=intersectionTimes(start1,end1,start2,end2);
  return intersection===null?false:intersection[0]!==intersection[1];
}

export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(mins);
  return date;
}

/**
 * Given a time string (e.g. "14:30"), returns the current task and the next task
 * from the tasks list, considering day-of-week.
 * @param {string} time - Time in "HH:MM" format
 * @param {Array} tasks - Array of task objects with start, end, days properties
 * @param {number} [dayIndex=0] - Day index (0=Monday, 6=Sunday)
 * @returns {{current: object|null, next: object|null}} - Current and next task objects
 */
export function getCurrentAndNextTask(time, tasks, dayIndex = 0) {
  // Parse the given time
  const [givenHours, givenMinutes] = time.split(':').map(Number);
  const givenMinutesTotal = givenHours * 60 + givenMinutes;

  let currentTask = null;
  let nextTask = null;
  let nextTaskIndex = tasks.length; // Initialize beyond array bounds

  tasks.forEach((task, index) => {
    // Skip tasks that don't repeat on the given day
    if (!task.days[dayIndex]) return;

    const [startHours, startMinutes] = task.start.split(':').map(Number);
    const [endHours, endMinutes] = task.end.split(':').map(Number);
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;

    // Handle overnight tasks (end before start, e.g. 22:00-06:00)
    const isOvernight = endTotal < startTotal;

    let isCurrent = false;
    let isAfter = false;

    if (isOvernight) {
      // Overnight task: time is current if >= start OR < end
      isCurrent = givenMinutesTotal >= startTotal || givenMinutesTotal < endTotal;
      isAfter = givenMinutesTotal >= endTotal && givenMinutesTotal < startTotal;
    } else {
      // Normal task: time is current if within [start, end)
      isCurrent = givenMinutesTotal >= startTotal && givenMinutesTotal < endTotal;
      isAfter = givenMinutesTotal >= endTotal;
    }

    if (isCurrent) {
      currentTask = task;
      // Find the next task after this one (by start time)
      // We'll continue searching below
    }

    if (isAfter) {
      // This task ends before the given time - it's a candidate for "next"
      if (index < nextTaskIndex) {
        nextTaskIndex = index;
        nextTask = task;
      }
    }
  });

  // If no task is currently active but we have tasks that end after the given time,
  // find the earliest starting task from now
  if (!currentTask) {
    // Find the next task that starts after the given time
    tasks.forEach((task, index) => {
      if (!task.days[dayIndex]) return;

      const [startHours, startMinutes] = task.start.split(':').map(Number);
      const startTotal = startHours * 60 + startMinutes;

      if (startTotal > givenMinutesTotal && index < nextTaskIndex) {
        nextTaskIndex = index;
        nextTask = task;
      }
    });
  }

  return { current: currentTask, next: nextTask };
}