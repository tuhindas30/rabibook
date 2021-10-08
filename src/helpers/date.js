const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const dateToMonYYYY = (dateString) => {
  const date = new Date(dateString);
  const mon = date.getMonth();
  const yyyy = date.getFullYear();
  return `${shortMonths[mon]} ${yyyy}`;
};

const dateToMonDDYYYY = (dateString) => {
  const date = new Date(dateString);
  const d = date.getDate();
  const mon = date.getMonth();
  const dd = d < 10 ? "0" + d : d;
  const yyyy = date.getFullYear();
  return `${shortMonths[mon]} ${dd}, ${yyyy}`;
};

const dateToRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date().getTime();
  const secondsPast = (now - date) / 1000;
  if (secondsPast < 0) {
    return "0s";
  }
  if (secondsPast >= 0 && secondsPast < 60) {
    return `${parseInt(secondsPast)}s`;
  }
  if (secondsPast < 60 * 60) {
    return `${parseInt(secondsPast / 60)}m`;
  }
  if (secondsPast < 24 * 60 * 60) {
    return `${parseInt(secondsPast / (60 * 60))}h`;
  }
  if (secondsPast < 30 * 24 * 60 * 60) {
    return `${parseInt(secondsPast / (24 * 60 * 60))}d`;
  }
  if (secondsPast > 30 * 24 * 60 * 60) {
    return dateToMonDDYYYY(date);
  }
};

export { dateToMonYYYY, dateToMonDDYYYY, dateToRelativeTime };
