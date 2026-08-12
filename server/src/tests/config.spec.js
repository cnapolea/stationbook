import { expect, test } from 'vitest';

test.describe('App configurations', () => {
  test('Check correct test db connection', () => {
    expect(process.env.DATABASE_URL).match(/stationbook_test$/);
  });
});
