/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { deriveToHaveReceivedMessage, deriveToReceiveMessage } from '../deriving';
import WS from '../websocket';

let server: WS, client: WebSocket;
beforeEach(async () => {
  server = new WS('ws://localhost:1234');
  client = new WebSocket('ws://localhost:1234');
  await server.connected;
});

afterEach(() => {
  WS.clean();
});

describe('A custom matcher `toReceiveHello` derived from toReceiveMessage', () => {
  expect.extend({
    toReceiveHello: deriveToReceiveMessage('toReceiveHello', function (received) {
      const pass = received === 'Hello';
      const message = pass
        ? () => `Expected the next received message is not Hello, but got ${received}`
        : () => `Expected the next received message is Hello, but got ${received}`;

      return {
        actual: received,
        expected: 'Hello',
        message,
        pass,
      };
    }),
  });

  it('passes when received "Hello"', async () => {
    client.send('Hello');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (expect(server) as any).toReceiveHello();
  });

  it('fails when received "Hi!"', async () => {
    client.send('Hi!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect((expect(server) as any).toReceiveHello()).rejects.toThrowErrorMatchingInlineSnapshot(
      '"Expected the next received message is Hello, but got Hi!"'
    );
  });

  it('fails when received "Hello" under .not context', async () => {
    client.send('Hello');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect((expect(server) as any).not.toReceiveHello()).rejects.toThrowErrorMatchingInlineSnapshot(
      '"Expected the next received message is not Hello, but got Hello"'
    );
  });

  it('passes when received "Hi!" under .not context', async () => {
    client.send('Hi!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (expect(server) as any).not.toReceiveHello();
  });
});

describe('A custom matcher `toHaveHello` derived from toHaveReceivedMessages', () => {
  expect.extend({
    toHaveHello: deriveToHaveReceivedMessage('toHaveHello', function (received) {
      const pass = received.includes('Hello');
      const message = pass
        ? () => `Expected the WS server to not have received Hello, but got ${received}`
        : () => `Expected the WS server to have received Hello, but got ${received}`;

      return {
        actual: received,
        expected: ['Hello'],
        message,
        pass,
      };
    }),
  });

  it('passes when received "Hello"', async () => {
    client.send('Hi!');
    client.send('Hello');
    await server.nextMessage;
    await server.nextMessage;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (expect(server) as any).toHaveHello();
  });

  it('fails when not received "Hello"', async () => {
    client.send('Hi!');
    client.send('Yo');
    await server.nextMessage;
    await server.nextMessage;
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (expect(server) as any).toHaveHello();
    }).toThrowErrorMatchingInlineSnapshot('"Expected the WS server to have received Hello, but got Hi!,Yo"');
  });

  it('fails when received "Hello" under .not context', async () => {
    client.send('Hi!');
    client.send('Hello');
    await server.nextMessage;
    await server.nextMessage;
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (expect(server) as any).not.toHaveHello();
    }).toThrowErrorMatchingInlineSnapshot('"Expected the WS server to not have received Hello, but got Hi!,Hello"');
  });

  it('passes when not received "Hello" under .not context', async () => {
    client.send('Hi!');
    client.send('Yo');
    await server.nextMessage;
    await server.nextMessage;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (expect(server) as any).not.toHaveHello();
  });
});
