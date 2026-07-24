import { TIME_SLOT_HEIGHT_PX } from '../utils/constants';

export const calculateTimeFromPixelOffset = (
  pixelY: number,
  baseDate: Date,
  slotDurationMinutes = 30
): Date => {
  const slots = Math.floor(pixelY / TIME_SLOT_HEIGHT_PX);
  const minutes = slots * slotDurationMinutes;

  const result = new Date(baseDate);
  result.setHours(0, 0, 0, 0);
  result.setMinutes(minutes);

  return result;
};

export const calculatePixelOffsetFromTime = (date: Date): number => {
  const minutesInDay = date.getHours() * 60 + date.getMinutes();
  const slots = minutesInDay / 30;
  return slots * TIME_SLOT_HEIGHT_PX;
};