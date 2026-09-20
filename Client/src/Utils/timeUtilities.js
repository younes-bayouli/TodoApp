export function format(time) {
  const d = time;

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
  return `${String(minutes/60).padStart(2, "0")}:${String(minutes%60).padStart(2, "0")}`
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

export function checkOverLapTime(start1,end1,start2,end2){
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
