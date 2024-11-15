export interface AuthTranslations {
  signIn: string;
  signUp: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  forgotPassword: string;
  resetPassword: string;
  createAccount: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  signInToAccount: string;
  createNewAccount: string;
  enterEmailForReset: string;
  resetEmailSent: string;
  backToSignIn: string;
  passwordMinLength: string;
  loading: {
    signingIn: string;
    creatingAccount: string;
    sendingResetLink: string;
  };
  errors: {
    login: string;
    signup: string;
    resetPassword: string;
    passwordsDoNotMatch: string;
    invalidEmail: string;
    requiredField: string;
  };
  placeholders: {
    email: string;
    password: string;
    fullName: string;
  };
}
