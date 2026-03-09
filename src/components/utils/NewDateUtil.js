function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" });
}
function formatShort(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
}
function getMonth(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month:"long", year:"numeric" });
}


export {formatDate, formatShort, getMonth}