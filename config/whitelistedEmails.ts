// Pre-whitelisted email addresses for immediate access
// These users can sign in and use the application without manual approval

export const WHITELISTED_EMAILS = [
  'drpratichi@skids.health',
  'dr.satish@greybrain.ai', 
  'dev@santaan.in',
  'raghab.panda@santaan.in',
  'Lnmishra84@gmail.com',
  'satish@skids.health' // Original test email
] as const;

export type WhitelistedEmail = typeof WHITELISTED_EMAILS[number];

// Helper function to check if an email is whitelisted
export const isWhitelistedEmail = (email: string): boolean => {
  return WHITELISTED_EMAILS.includes(email as WhitelistedEmail);
};