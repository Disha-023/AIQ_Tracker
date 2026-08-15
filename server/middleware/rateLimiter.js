const attemptTracker = new Map();
const MAX_ATTEMPTS = 3;
const LOCK_TIME_MS = 5 * 60 * 1000; // 5 minutes lock

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const record = attemptTracker.get(ip);

  if (record && record.attempts >= MAX_ATTEMPTS) {
    if (now - record.lastAttempt < LOCK_TIME_MS) {
      return res.status(429).json({
        success: false,
        message: 'Too many unsuccessful attempts. Please try again later.'
      });
    } else {
      // Lock expired -> reset
      attemptTracker.delete(ip);
    }
  }

  req.recordFailedAttempt = () => {
    const current = attemptTracker.get(ip) || { attempts: 0, lastAttempt: Date.now() };
    attemptTracker.set(ip, {
      attempts: current.attempts + 1,
      lastAttempt: Date.now()
    });
  };

  req.resetAttempts = () => {
    attemptTracker.delete(ip);
  };

  next();
}

module.exports = rateLimiter;
