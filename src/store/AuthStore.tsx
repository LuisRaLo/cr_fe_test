import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import CONSTANTS from "../domain/constants";
import axios from "axios";
import { ConfirmSignUpRequest, SignUpRequest } from "../hooks/useSignUp";
import {
  SignIn,
  SignInMFA,
  SignInMFAResponse,
  SignInRequest,
  SignInResponse,
} from "../hooks/useSignIn";

export interface IConfirmMFRequest {
  user: string;
  authenticator_code: string;
  session: string;
}
export interface IAuthenticationState {
  token: string | null;
  session: SignIn | SignInMFA | null;
  challengeName: string[];

  isFetching: boolean;
  authError: string;
  authStep:
    | "CONFIRM_SIGN_UP"
    | "DONE"
    | "CONFIRMED_SIGN_UP"
    | "MFA_CHALLENGE"
    | "MFA_CONFIRMED"
    | "";
  showModalToConfirm: boolean;

  signin: (payload: SignInRequest) => Promise<void>;
  signup: (payload: SignUpRequest) => Promise<void>;
  confirmSignup: (payload: ConfirmSignUpRequest) => Promise<void>;
  signout: () => void;
  setSession: (session: SignIn | SignInMFA) => void;
  verifyMFA: (user: string, authenticator_code: string) => Promise<void>;
  setChallenges: (challengeName: string[]) => void;

  setShowModalToConfirm: (showModalToConfirm: boolean) => void;
  setJWT: (jwt: string | null) => void;
  setIsFetching: (isFetching: boolean) => void;
  resetAuthError: () => void;
}

const useAuthStore = create<IAuthenticationState>()(
  persist(
    (set, get) => ({
      token: null,
      session: null,
      challengeName: [],
      isFetching: false,
      authError: "",
      authStep: "",
      showModalToConfirm: false,

      setShowModalToConfirm: (showModalToConfirm: boolean) => {
        set({ showModalToConfirm });
      },

      setJWT: (token: string | null) => set({ token }),

      setIsFetching: (isFetching: boolean) => set({ isFetching }),

      resetAuthError: () => set({ authError: "" }),
      resetSession: () => set({ session: null }),

      setSession: (session: SignIn | SignInMFA) => {
        set({ session });
      },

      setChallenges: (challengeName: string[]) => set({ challengeName }),

      signin: async (payload: SignInRequest) => {
        try {
          set({ isFetching: true });

          const url = CONSTANTS.BASE_URL + CONSTANTS.SIGNIN;

          const req = await axios.post(
            url,
            {
              user: payload.user,
              password: payload.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              validateStatus: function (status: number) {
                return status >= 200 && status < 500;
              },
            }
          );

          const data: SignInResponse | SignInMFAResponse = req.data;

          if (req.status === 200) {
            if (Object.keys(data.resultado).includes("session")) {
              set({ session: (data as SignInMFAResponse).resultado });
              set({
                challengeName: [
                  ...get().challengeName,
                  (data as SignInMFAResponse).resultado.challenge_name,
                ],
              });
            } else {
              set({
                token: (data as SignInResponse).resultado.authentication_result
                  .AccessToken,
                session: data.resultado,
              });
            }
            return;
          }

          throw new Error(req.data.resultado);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error);

          set({ authError: error.message });
        } finally {
          set({ isFetching: false });
        }
      },

      signup: async (payload: SignUpRequest): Promise<void> => {
        try {
          set({ isFetching: true });

          const url = CONSTANTS.BASE_URL + CONSTANTS.SIGNUP;

          console.log("url", url);

          const req = await axios.post(
            url,
            {
              email: payload.email,
              password: payload.password,
              repeat_password: payload.repeatPassword,
              name: payload.name,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              validateStatus: function (status: number) {
                return status >= 200 && status < 500;
              },
            }
          );

          if (req.status === 200) {
            set({ authStep: "CONFIRM_SIGN_UP" });
            set({ showModalToConfirm: true });
            return;
          }

          throw new Error(req.data.resultado);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error);

          set({ authError: error.message });
        } finally {
          set({ isFetching: false });
        }
      },

      confirmSignup: async (payload: ConfirmSignUpRequest) => {
        try {
          set({ isFetching: true });

          const url = CONSTANTS.BASE_URL + CONSTANTS.CONFIRM_SIGN_UP;

          const req = await axios.post(
            url,
            {
              user: payload.email,
              confirmation_code: payload.code,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              validateStatus: function (status: number) {
                return status >= 200 && status < 500;
              },
            }
          );

          if (req.status === 200) {
            set({ authStep: "CONFIRMED_SIGN_UP" });
            set({ showModalToConfirm: false });

            return;
          }

          throw new Error(req.data.resultado);
        } catch (error) {
          console.error(error);
        } finally {
          set({ isFetching: false });
        }
      },

      signout: () => {
        set({ token: null, session: null, challengeName: [] });
      },

      verifyMFA: async (
        user: string,
        authenticator_code: string
      ): Promise<void> => {
        try {
          set({ isFetching: true });

          const url = CONSTANTS.BASE_URL + CONSTANTS.MFA_VERIFY;

          const req = await axios.post(
            url,
            {
              user: user,
              authenticator_code: authenticator_code,
              session: (useAuthStore.getState().session as SignInMFA).session,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              validateStatus: function (status: number) {
                return status >= 200 && status < 500;
              },
            }
          );

          const data = req.data;

          if (req.status === 200) {
            set({
              token: (data as SignInResponse).resultado.authentication_result
                .AccessToken,
            });
            set({ session: (data as SignInResponse).resultado });

            set({ authStep: "MFA_CONFIRMED" });

            return;
          } else if (req.status == 400) {
            console.log("ENTRE AQUI");
            data?.resultado == "Sesión no válida o expirada." &&
              set({ authError: "Sesión no válida o expirada." });

            set({ session: null });

            return;
          }

          throw new Error(req.data.resultado);
        } catch (error) {
          console.error(error);
        } finally {
          set({ isFetching: false });
        }
      },
    }),
    {
      name: "token",
      storage: createJSONStorage(() => sessionStorage),
      partialize(state) {
        return {
          session: state.session,
          challenges: state.challengeName,
          token: state.token,
        };
      },
    }
  )
);

export default useAuthStore;
