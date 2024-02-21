const eventEmitter = new EventTarget();

const EVENT_NAME = "cell-value-update";

export interface CellCoordinates {
  rowIdx: number;
  columnIdx: number;
}

export type SubscriptionCallback = (coordinates: CellCoordinates) => void;

export function getEventEmitter() {
  return {
    emitEvent: (coordinates: CellCoordinates) => {
      const event = new CustomEvent(EVENT_NAME, { detail: coordinates });
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
