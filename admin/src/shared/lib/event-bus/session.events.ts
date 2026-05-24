import mitt from "mitt";

export const SessionEvent = {
  SessionExpired: "session:expired",
} as const;

export type SessionEvent = (typeof SessionEvent)[keyof typeof SessionEvent];

type SessionEventMap = {
  [SessionEvent.SessionExpired]: void;
};

export const sessionEventBus = mitt<SessionEventMap>();
