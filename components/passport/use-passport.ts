"use client";

import {
  PASSPORT_EVENT,
  PASSPORT_STORAGE_KEY,
  acceptMission,
  approveReview,
  completedCount,
  confirmPartner,
  submitFieldReport,
  emptyPassport,
  getMissionStatus,
  readPassport,
  type FieldAttachment,
  type MissionProgressStatus,
  type PassportState,
} from "@/lib/passport";
import { useCallback, useSyncExternalStore } from "react";

const serverPassport = emptyPassport();

let cachedRaw: string | null | undefined;
let cachedState: PassportState = serverPassport;

function subscribe(onStoreChange: () => void) {
  const notify = () => {
    cachedRaw = undefined;
    onStoreChange();
  };
  window.addEventListener("storage", notify);
  window.addEventListener(PASSPORT_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(PASSPORT_EVENT, notify);
  };
}

function getSnapshot() {
  const raw = window.localStorage.getItem(PASSPORT_STORAGE_KEY);
  if (cachedRaw === raw && cachedState !== serverPassport) return cachedState;
  cachedRaw = raw;
  cachedState = readPassport();
  return cachedState;
}

function getServerSnapshot() {
  return serverPassport;
}

export function usePassport() {
  const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const ready = state !== serverPassport;

  const accept = useCallback((id: string) => {
    acceptMission(id);
  }, []);

  const submitReport = useCallback(
    (
      id: string,
      report: {
        reflection: string;
        discovery: string;
        attachment?: FieldAttachment;
      },
    ) => {
      submitFieldReport(id, report);
    },
    [],
  );

  const confirm = useCallback((id: string) => {
    confirmPartner(id);
  }, []);

  const approve = useCallback((id: string) => {
    approveReview(id);
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
    submitReport,
    confirmPartner: confirm,
    approveReview: approve,
  };
}
