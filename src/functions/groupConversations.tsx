import { format, isToday, isYesterday, startOfWeek, isAfter } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const timeZone = "America/Manaus";

export function groupConversations(conversations: any[]) {
  const today: any = [];
  const yesterday: any = [];
  const lastWeek: any = [];
  const older: any = [];

  const startOfLastWeek = startOfWeek(new Date(), { weekStartsOn: 0 });

  conversations.forEach((conv) => {
    const convDate = toZonedTime(new Date(conv.createdAt), timeZone);

    if (isToday(convDate)) {
      today.push({ ...conv, formattedDate: format(convDate, "HH:mm") });
    } else if (isYesterday(convDate)) {
      yesterday.push({ ...conv, formattedDate: format(convDate, "HH:mm") });
    } else if (isAfter(convDate, startOfLastWeek)) {
      lastWeek.push({ ...conv, formattedDate: format(convDate, "EEEE HH:mm") });
    } else {
      older.push({ ...conv, formattedDate: format(convDate, "dd/MM/yyyy HH:mm") });
    }
  });

  return { today, yesterday, lastWeek, older };
}
