const indiaDate = (date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

// A retry must not create another automatic snapshot on the same India date.
// All three sources must have refreshed successfully before a run can be skipped.
export function refreshedToday(snapshot, now = new Date()) {
  const today = indiaDate(now);
  return [
    snapshot?.calendar,
    snapshot?.repositories,
    snapshot?.languages,
  ].every((source) => {
    const timestamp = source?.fetchedAt;
    if (
      typeof timestamp !== "string" ||
      !Number.isFinite(Date.parse(timestamp))
    )
      return false;
    return indiaDate(new Date(timestamp)) === today;
  });
}
