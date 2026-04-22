import mitt from "mitt";

export enum SessionEvent {
  SessionExpired = "session:expired",
}

type SessionEventMap = {
  [SessionEvent.SessionExpired]: void;
};

export const sessionEventBus = mitt<SessionEventMap>();
