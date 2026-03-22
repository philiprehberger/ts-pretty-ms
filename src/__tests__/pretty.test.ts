import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { prettyMs, parseMs } from '../../dist/index.js';

describe('prettyMs', () => {
  it('should return "0ms" for 0', () => {
    assert.equal(prettyMs(0), '0ms');
  });

  it('should return "999ms" for 999', () => {
    assert.equal(prettyMs(999), '999ms');
  });

  it('should return "1s" for 1000', () => {
    assert.equal(prettyMs(1000), '1s');
  });

  it('should return "1m" for 60000', () => {
    assert.equal(prettyMs(60000), '1m');
  });

  it('should return "1h" for 3600000', () => {
    assert.equal(prettyMs(3600000), '1h');
  });

  it('should return "2h 30m 15s" for 9015000', () => {
    assert.equal(prettyMs(9015000), '2h 30m 15s');
  });

  it('should return compact form', () => {
    assert.equal(prettyMs(9015000, { compact: true }), '2h');
  });

  it('should return verbose form', () => {
    assert.equal(prettyMs(9015000, { verbose: true }), '2 hours 30 minutes 15 seconds');
  });

  it('should return colon notation', () => {
    assert.equal(prettyMs(9015000, { colonNotation: true }), '2:30:15');
  });

  it('should limit units with unitCount', () => {
    assert.equal(prettyMs(9015000, { unitCount: 2 }), '2h 30m');
  });

  it('should handle negative values', () => {
    assert.equal(prettyMs(-1000), '-1s');
  });

  it('should handle sub-second values', () => {
    assert.equal(prettyMs(500), '500ms');
  });
});

describe('parseMs', () => {
  it('should parse "2h 30m" to 9000000', () => {
    assert.equal(parseMs('2h 30m'), 9000000);
  });

  it('should parse "1s" to 1000', () => {
    assert.equal(parseMs('1s'), 1000);
  });

  it('should parse "500ms" to 500', () => {
    assert.equal(parseMs('500ms'), 500);
  });

  it('should parse colon notation "2:30:15"', () => {
    assert.equal(parseMs('2:30:15'), 9015000);
  });

  it('should round-trip correctly', () => {
    const ms = 9015000;
    const str = prettyMs(ms);
    assert.equal(parseMs(str), ms);
  });
});
