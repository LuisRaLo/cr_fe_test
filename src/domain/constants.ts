const CONSTANTS = {
  BASE_URL: import.meta.env.VITE_BASE_URL,

  SIGNIN: "/auth/signin",
  SIGNUP: "/auth/signup",
  CONFIRM_SIGN_UP: "/auth/confirm-signup",
  MFA_VERIFY: "/auth/mfa/verify",
  MFA_CODE: "/auth/mfa/code",
  MFA_CHALLENGE: "/auth/mfa/challenge",
  MFA_RESEND: "/auth/mfa/resend",
};

export default CONSTANTS;
