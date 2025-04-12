import rateLimit from 'express-rate-limit';

// Requests limiters
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // every 15 mins
  max: 5, // max 5 requests
  message: {
    code: 429,
    message:
      '🌙 Logowanie chwilowo wstrzymane. Odpręż się i spróbuj ponownie za 15 minut.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // every 15 mins
  max: 5, // max 5 requests
  message: {
    code: 429,
    message:
      '🌙 Logowanie chwilowo wstrzymane. Odpręż się i spróbuj ponownie za 15 minut.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
