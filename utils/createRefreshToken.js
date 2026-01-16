import crypto from "crypto";

/**
 * @returns {string}
 */
export const createRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};
