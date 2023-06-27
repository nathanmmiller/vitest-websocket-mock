/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { ExpectationResult, RawMatcherFn } from '@vitest/expect';

import type { DeserializedMessage } from '../websocket';
import WS from '../websocket';
import makeInvalidWsMessage from './makeInvalidWsMessage';

export default function deriveToHaveReceivedMessage(name: string, fn: RawMatcherFn): RawMatcherFn {
  return function (ws: WS, expected: Array<DeserializedMessage>, options?: unknown): ExpectationResult {
    const isWS = ws instanceof WS;
    if (!isWS) {
      return {
        pass: this.isNot, // always fail
        message: makeInvalidWsMessage.bind(this, ws, name),
      };
    }

    return fn.call(this, ws.messages, expected, options);
  };
}
