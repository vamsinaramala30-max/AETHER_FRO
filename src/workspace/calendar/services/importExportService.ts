import { CalendarEvent } from '../types/event';

export class ImportExportService {
  public static exportToICS(events: CalendarEvent[]): string {
    let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Enterprise Calendar Module//EN\r\n";

    events.forEach(event => {
      const startDate = new Date(event.start).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const endDate = new Date(event.end).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      icsContent += "BEGIN:VEVENT\r\n";
      icsContent += `UID:${event.id}\r\n`;
      icsContent += `SUMMARY:${event.title}\r\n`;
      if (event.description) icsContent += `DESCRIPTION:${event.description}\r\n`;
      if (event.location?.name) icsContent += `LOCATION:${event.location.name}\r\n`;
      icsContent += `DTSTART:${startDate}\r\n`;
      icsContent += `DTEND:${endDate}\r\n`;
      icsContent += "END:VEVENT\r\n";
    });

    icsContent += "END:VCALENDAR";
    return icsContent;
  }

  public static downloadICS(events: CalendarEvent[], filename = "calendar.ics"): void {
    const content = this.exportToICS(events);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}