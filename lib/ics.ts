import { TimelineItem } from "@/lib/types";

function toUtcStamp(date: string) {
  const d = new Date(date);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

export function generateIcs(title: string, items: TimelineItem[]) {
  const header = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HanMi DocKit//Timeline//EN"
  ];
  const events = items.flatMap((item) => [
    "BEGIN:VEVENT",
    `UID:${item.id}@hanmi-dockit`,
    `DTSTAMP:${toUtcStamp(new Date().toISOString())}T000000Z`,
    `DTSTART;VALUE=DATE:${toUtcStamp(item.date)}`,
    `SUMMARY:${title} - ${item.title}`,
    `DESCRIPTION:${item.note}`,
    "END:VEVENT"
  ]);
  const footer = ["END:VCALENDAR"];
  return [...header, ...events, ...footer].join("\r\n");
}
