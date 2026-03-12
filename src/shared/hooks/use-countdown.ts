import { useEffect, useMemo, useState } from 'react';

function getRemainingSeconds(targetIso: string | null | undefined) {
  if (!targetIso) {
    return 0;
  }

  const targetTime = new Date(targetIso).getTime();

  if (Number.isNaN(targetTime)) {
    return 0;
  }

  return Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
}

export function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function useCountdown(targetIso: string | null | undefined) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(targetIso),
  );

  useEffect(() => {
    setRemainingSeconds(getRemainingSeconds(targetIso));

    if (!targetIso) {
      return undefined;
    }

    const interval = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(targetIso));
    }, 1_000);

    return () => {
      clearInterval(interval);
    };
  }, [targetIso]);

  return useMemo(
    () => ({
      isComplete: remainingSeconds <= 0,
      label: formatCountdown(remainingSeconds),
      remainingSeconds,
    }),
    [remainingSeconds],
  );
}
