const BASE_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

export function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = firstDay.getDay();

  const matrix: Array<
    Array<{ day: number; type: "prev" | "current" | "next" }>
  > = [];
  let week: Array<{ day: number; type: "prev" | "current" | "next" }> = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push({ day: daysInPrevMonth - firstDayOfWeek + i + 1, type: "prev" });
  }

  [
    ...BASE_DAYS,
    ...Array.from({ length: daysInMonth - 28 }, (_, i) => i + 29),
  ].forEach((d) => {
    if (d > daysInMonth) return;
    week.push({ day: d, type: "current" });
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  });

  if (week.length > 0) {
    let nextDay = 1;
    while (week.length < 7) {
      week.push({ day: nextDay++, type: "next" });
    }
    matrix.push(week);
  }

  return matrix;
}
