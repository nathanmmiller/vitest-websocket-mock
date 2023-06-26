/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { ExpectationResult } from '@vitest/expect';
import { diff } from 'jest-diff';

import { deriveToReceiveMessage } from '../deriving';

const toReceiveMessage = deriveToReceiveMessage('toReceiveMessage', function (received, expected): ExpectationResult {
  const pass = this.equals(received, expected);

  const message = pass
    ? () =>
        this.utils.matcherHint('.not.toReceiveMessage', 'WS', 'expected') +
        '\n\n' +
        `Expected the next received message to not equal:\n` +
        `  ${this.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(received)}`
    : () => {
        const diffString = diff(expected, received, { expand: this.expand });
        return (
          this.utils.matcherHint('.toReceiveMessage', 'WS', 'expected') +
          '\n\n' +
          `Expected the next received message to equal:\n` +
          `  ${this.utils.printExpected(expected)}\n` +
          `Received:\n` +
          `  ${this.utils.printReceived(received)}\n\n` +
          `Difference:\n\n${diffString}`
        );
      };

  return {
    actual: received,
    expected,
    message,
    pass,
  };
});

export default toReceiveMessage;
