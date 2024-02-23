import { Cell, CellCoordinates } from "./types";

const eventEmitter = new EventTarget();

const EVENT_NAME = "cell-value-update";

export type SubscriptionCallback = (coordinates: UpdateEvent) => void;

export type UpdateEvent = CellCoordinates & {
  value: Cell;
  calculated: string;
};

export function getEventEmitter() {
  return {
    emitEvent: (update: UpdateEvent) => {
      const event = new CustomEvent(EVENT_NAME, { detail: update });
      eventEmitter.dispatchEvent(event);
    },
    subscribe: (callback: SubscriptionCallback): (() => void) => {
      const cb: EventListenerOrEventListenerObject = (e) => {
        callback((e as CustomEvent).detail);
      };

      eventEmitter.addEventListener(EVENT_NAME, cb);

      return () => {
        eventEmitter.removeEventListener(EVENT_NAME, cb);
      };
    },
  };
}
