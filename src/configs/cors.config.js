if (!process.env.ALLOW_ORIGIN)
  console.warn("ALLOW_ORIGIN is not defined in environment variables");
const allowedOrigins = process.env.ALLOW_ORIGIN.split(",").map((origin) => origin.trim());

export const corsOptions = {
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH","DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  credentials: true,
  optionsSuccessStatus: 200,
};
