import {
  signIn,
  SignInInput,
  SignInOutput,
  signUp,
  SignUpInput,
  SignUpOutput,
  ConfirmSignUpInput,
  confirmSignUp,
} from "aws-amplify/auth";
import { create } from "zustand";

interface IAuthenticationState {
  user: any;
  jwt: string;
  setUser: (user: any) => void;
  setJwt: (jwt: string) => void;
  logout: () => void;
  signin: (email: string, password: string) => void;
  signup: (
    email: string,
    password: string,
    repeatPassword: string,
    name: string
  ) => void;
}

const useAuthStore = create<IAuthenticationState>()((set) => ({
  user: null,
  jwt: "",
  setUser: (user: any) => set({ user }),
  setJwt: (jwt: any) => set({ jwt }),
  logout: () => set({ user: null, jwt: "" }),

  signin: async (email: string, password: string) => {
    const data: SignInInput = {
      username: email,
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    };

    try {
      const { nextStep, isSignedIn }: SignInOutput = await signIn(data);

      console.log("isSignedIn", isSignedIn, nextStep);

      if (nextStep.signInStep === "DONE") {
        console.log("user", nextStep);
      }

      const confirmData: ConfirmSignUpInput = {
        username: email,
        confirmationCode: "123456",
      };

      const confirmSignUpOutput = await confirmSignUp(confirmData);
    } catch (error) {
      console.error(error);
    }
  },

  signup: async (
    email: string,
    password: string,
    repeatPassword: string,
    name: string
  ) => {
    console.log(email, password, repeatPassword, name);

    const data: SignUpInput = {
      username: email,
      password,
      options: {
        userAttributes: {
          name,
        },
      },
    };

    try {
      const { nextStep, isSignUpComplete }: SignUpOutput = await signUp(data);

      console.log("isSignedIn", isSignUpComplete, nextStep);

      if (nextStep.signUpStep === "DONE") {
        console.log("user", nextStep);
      }
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useAuthStore;
