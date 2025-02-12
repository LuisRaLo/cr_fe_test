import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ConfirmSignUpRequest, SignUpRequest } from "../hooks/useSignUp";
import {
  MFAAuthChallengeRequest,
  SignIn,
  SignInMFA,
  SignInRequest,
} from "../hooks/useSignIn";
import { getRequest, postRequest } from "../utils/axios";
import CONSTANTS from "../domain/constants";

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

  // Métodos de la tienda (acciones)
  signin: (payload: SignInRequest) => Promise<void>;
  signup: (payload: SignUpRequest) => Promise<void>;
  confirmSignup: (payload: ConfirmSignUpRequest) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirmMFA: (payload: MFAAuthChallengeRequest) => Promise<any>;
  signout: () => void;
  setSession: (session: SignIn | SignInMFA) => void;
  getMFASecret: () => Promise<string>;
  verifyMFA: (user: string, authenticator_code: string) => Promise<void>;
  setChallenges: (challengeName: string[]) => void;
  setShowModalToConfirm: (showModalToConfirm: boolean) => void;
  setJWT: (jwt: string | null) => void;
  setIsFetching: (isFetching: boolean) => void;
  resetAuthError: () => void;
  resendMFACode: (user: string) => Promise<void>;
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

      setShowModalToConfirm: (showModalToConfirm) =>
        set({ showModalToConfirm }),

      setJWT: (token) => set({ token }),

      setIsFetching: (isFetching) => set({ isFetching }),

      resetAuthError: () => set({ authError: "" }),

      setSession: (session) => set({ session }),

      setChallenges: (challengeName) => set({ challengeName }),

      // Función para iniciar sesión
      signin: async (payload) => {
        const { isFetching } = get();
        if (isFetching) return;

        set({ isFetching: true, authError: "" });

        try {
          const url = CONSTANTS.BASE_URL + CONSTANTS.SIGNIN;

          const response = await postRequest(url, {
            user: payload.user,
            password: payload.password,
          });

          const { resultado, mensaje } = response.data;

          if (response.status === 404) {
            set({ authError: "Usuario no encontrado" });
            return;
          }

          if (mensaje === "Usuario no confirmado.") {
            set({
              authStep: "CONFIRM_SIGN_UP",
              showModalToConfirm: true,
              authError: mensaje,
            });
            return;
          }

          if ("session" in resultado) {
            set({
              session: resultado,
              challengeName: [...get().challengeName, resultado.challenge_name],
            });
          } else {
            set({
              token: resultado.authentication_result.AccessToken,
              session: resultado,
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("SignIn Error:", error);
          set({ authError: error.message || "An error occurred" });
        } finally {
          set({ isFetching: false });
        }
      },

      // Función para registrar
      signup: async (payload) => {
        set({ isFetching: true, authError: "" });

        try {
          const url = CONSTANTS.BASE_URL + CONSTANTS.SIGNUP;
          const response = await postRequest(url, {
            email: payload.email,
            password: payload.password,
            repeat_password: payload.repeatPassword,
            name: payload.name,
          });

          const { resultado } = response.data;

          if (resultado === "El usuario ya existe.") {
            set({ authError: resultado });
            return;
          }

          if (response.status === 200) {
            set({ authStep: "CONFIRM_SIGN_UP", showModalToConfirm: true });
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("SignUp Error:", error);
          set({ authError: error.message || "An error occurred" });
        } finally {
          set({ isFetching: false });
        }
      },

      // Confirmar registro
      confirmSignup: async (payload) => {
        set({ isFetching: true, authError: "" });

        try {
          const url = CONSTANTS.BASE_URL + CONSTANTS.CONFIRM_SIGN_UP;
          const response = await postRequest(url, {
            user: payload.email,
            confirmation_code: payload.code,
          });

          const { mensaje } = response.data;

          if (
            mensaje ===
            "El código de confirmación ha expirado. Se ha enviado un nuevo código a su correo electrónico."
          ) {
            set({ authError: mensaje });
            return;
          }

          if (response.status === 200) {
            set({ authStep: "CONFIRMED_SIGN_UP", showModalToConfirm: false });
          } else if (response.status === 401) {
            set({ authError: "401" });
          } else if (response.status === 429) {
            set({ authError: "Demasiados intentos, intente más tarde" });
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("ConfirmSignUp Error:", error);
          set({ authError: error.message || "An error occurred" });
        } finally {
          set({ isFetching: false });
        }
      },

      // Cerrar sesión
      signout: () => set({ token: null, session: null, challengeName: [] }),

      // Verificar MFA
      verifyMFA: async (user, authenticator_code) => {
        set({ isFetching: true, authError: "" });

        try {
          const url = CONSTANTS.BASE_URL + CONSTANTS.MFA_VERIFY;
          const session = get().session as SignInMFA;
          const response = await postRequest(url, {
            user,
            authenticator_code,
            session: session?.session,
          });

          if (response.status === 200) {
            const { resultado } = response.data;
            set({
              token: resultado.authentication_result.AccessToken,
              session: resultado,
              authStep: "MFA_CONFIRMED",
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("VerifyMFA Error:", error);
          set({ authError: error.message || "An error occurred" });
        } finally {
          set({ isFetching: false });
        }
      },

      // Función para registrar
      getMFASecret: async () => {
        set({ isFetching: true, authError: "" });

        try {
          const url = CONSTANTS.BASE_URL + CONSTANTS.MFA_CODE;
          const token = get().token;

          if (!token) {
            throw new Error("Token is null");
          }

          const response = await getRequest(url, token);

          if (response.status === 200) {
            return response.data.resultado.secret;
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("SignUp Error:", error);
          return "Ha ocurrido un error";
        } finally {
          set({ isFetching: false });
        }
      },

      // Confirmar MFA
      confirmMFA: async (payload: MFAAuthChallengeRequest) => {
        set({ isFetching: true, authError: "" });

        try {
          const url = CONSTANTS.BASE_URL + CONSTANTS.MFA_CHALLENGE;
          const response = await postRequest(url, {
            mfa_code: payload.mfa_code,
            access_token: payload.access_token,
          });

          if (response.status === 200) {
            set({
              authError: "",
              authStep: "MFA_CONFIRMED",
            });

            return response.data;
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("ConfirmMFA Error:", error);
          return error.message || "An error occurred";
        } finally {
          set({ isFetching: false });
        }
      },

      resendMFACode: async (user: string) => {
        set({ isFetching: true, authError: "" });

        try {
          const url = CONSTANTS.BASE_URL + CONSTANTS.MFA_RESEND;

          const response = await postRequest(url, { user });

          if (response.status === 200) {
            console.log("ResendMFA Response:", response.data);

            return response.data;
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("SignUp Error:", error);
          return "Ha ocurrido un error";
        } finally {
          set({ isFetching: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        session: state.session,
        challengeName: state.challengeName,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
