import { cleanupHostname } from './cleanup-hostname.function';

describe('cleanupHostname', () => {
  test('should not change a valid hostname', () => {
    const hostname = 'manchesterflorist.co.uk';
    const got = cleanupHostname(hostname);
    expect(got).toBe(hostname);
  });

  test('should remove prefix www and port number', () => {
    const hostname = 'www.manchesterflorist.co.uk:8080';
    const want = 'manchesterflorist.co.uk';
    const got = cleanupHostname(hostname);
    expect(got).toBe(want);
  });

  test('should make it lowercase', () => {
    const hostname = 'MANCHESTERFLORIST.CO.UK';
    const want = 'manchesterflorist.co.uk';
    const got = cleanupHostname(hostname);
    expect(got).toBe(want);
  });
});
