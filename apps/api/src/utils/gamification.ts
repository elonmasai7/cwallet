const levels = [
  { threshold: 0, label: "Beginner" },
  { threshold: 30, label: "Advocate" },
  { threshold: 80, label: "Watchdog" },
];

export function resolveLevel(points: number) {
  return levels.reduce((current, level) => {
    if (points >= level.threshold) {
      return level.label;
    }

    return current;
  }, "Beginner");
}

