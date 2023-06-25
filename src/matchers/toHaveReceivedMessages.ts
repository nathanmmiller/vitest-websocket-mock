/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { ExpectationResult } from '@vitest/expect';

import { deriveToHaveReceivedMessage } from '../deriving';
import type { DeserializedMessage } from '../websocket';

const toHaveReceivedMessages = deriveToHaveReceivedMessage(
  'toHaveReceivedMessages',
  function (received: Array<DeserializedMessage>, expected: Array<DeserializedMessage>): ExpectationResult {
    const equalities = expected.map((expectedMsg) =>
      // object comparison to handle JSON protocols
      received.some((receivedMsg) => this.equals(receivedMsg, expectedMsg))
    );
    const pass = this.isNot ? equalities.some(Boolean) : equalities.every(Boolean);

    const message = pass
      ? () =>
          this.utils.matcherHint('.not.toHaveReceivedMessages', 'WS', 'expected') +
          '\n\n' +
          `Expected the WS server to not have received the following messages:\n` +
          `  ${this.utils.printExpected(expected)}\n` +
          `But it received:\n` +
          `  ${this.utils.printReceived(received)}`
      : () => {
          return (
            this.utils.matcherHint('.toHaveReceivedMessages', 'WS', 'expected') +
            '\n\n' +
            `Expected the WS server to have received the following messages:\n` +
            `  ${this.utils.printExpected(expected)}\n` +
            `Received:\n` +
            `  ${this.utils.printReceived(received)}\n\n`
          );
        };

    return {
      actual: received,
      expected,
      message,
      pass,
    };
  }
);

export default toHaveReceivedMessages;
