import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const useCountdown = (targetDate) => {
  const calculateTimeLeft = () => {
    const now = dayjs();
    const future = dayjs(targetDate);
    const diff = future.diff(now);

    if (diff <= 0) return null;

    const dur = dayjs.duration(diff);

    return {
      years: dur.years(),
      months: dur.months(),
      weeks: Math.floor(dur.asWeeks()),
      days: dur.days(),
      hours: dur.hours(),
      minutes: dur.minutes(),
      seconds: dur.seconds(),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

export default useCountdown;
