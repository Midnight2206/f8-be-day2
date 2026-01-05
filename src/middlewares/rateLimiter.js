export function createRateLimiter({
  windowMs = 60000,
  maxRequests = 100,
  message = "Too many requests",
} = {}) {
  const IPs = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const record = IPs.get(ip);

    if (!record) {
      IPs.set(ip, { count: 1, startTime: now });
      return next();
    }

    const timePassed = now - record.startTime;

    if (timePassed > windowMs) {
      IPs.set(ip, { count: 1, startTime: now });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.error(429, message);
    }

    record.count += 1;
    next();
  };
}

export const apiRateLimiter = createRateLimiter({
  windowMs: 60000,
  maxRequests: 100,
  message: "Too many requests",
});
