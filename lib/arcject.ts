import 'server-only';

import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
} from '@arcjet/next';
import { env } from './env';

// Re-export the rules to simplify imports inside handlers
export { detectBot, fixedWindow, protectSignup, sensitiveInfo, shield, slidingWindow };

export default arcjet({
  key: env.ARCJET_KEY,
  // Use the fingerprint characteristic for
  // identifying and tracking users of requests.
  characteristics: ['fingerprint'],
  rules: [
    shield({
      mode: 'LIVE',
    }),
  ],
});
