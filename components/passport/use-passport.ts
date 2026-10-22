"use client";

import {
  PASSPORT_EVENT,
  acceptMission,
  completeMission,
  completedCount,
  emptyPassport,
  getMissionStatus,
  readPassport,
  type MissionProgressStatus,
  type PassportState,
} from "@/lib/passport";
import { useCallback, useEffect, useState } from "react";

export function usePassport() {
  const [state, setState] = useState<PassportState>(() => emptyPassport());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setState(readPassport());
    sync();
    setReady(true);

    window.addEventListener("storage", sync);
    window.addEventListener(PASSPORT_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(PASSPORT_EVENT, sync);
    };
  }, []);

  const accept = useCallback((id: string) => {
    setState(acceptMission(id));
  }, []);

  const complete = useCallback((id: string) => {
    setState(completeMission(id));
  }, []);

  const statusOf = useCallback(
    (id: string): MissionProgressStatus => getMissionStatus(state, id),
    [state],
  );

  return {
    ready,
    missions: state.missions,
    completed: completedCount(state),
    statusOf,
    accept,
    complete,
  };
}
