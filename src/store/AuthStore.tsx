import { create } from "zustand";
import CONSTANTS from "../domain/constants";
import axios from "axios";
import { ConfirmSignUpRequest, SignUpRequest } from "../hooks/useSignUp";

export interface IAuthenticationState {
  jwt: string;
  isFetching: boolean;
  authError: string;
  authStep: "CONFIRM_SIGN_UP" | "DONE" | "CONFIRMED_SIGN_UP" | "";
  showModalToConfirm: boolean;

  signup: (payload: SignUpRequest) => Promise<void>;
  confirmSignup: (payload: ConfirmSignUpRequest) => Promise<void>;

  setShowModalToConfirm: (showModalToConfirm: boolean) => void;
  setJWT: (jwt: string) => void;
  setIsFetching: (isFetching: boolean) => void;
  resetAuthError: () => void;
  signin: (email: string, password: string) => Promise<void>;
}

const useAuthStore = create<IAuthenticationState>()((set) => ({
  jwt: "",
  isFetching: false,
  authError: "",
  authStep: "",
  showModalToConfirm: false,

  setShowModalToConfirm: (showModalToConfirm: boolean) => {
    set({ showModalToConfirm });
  },

  setJWT: (jwt: string) => set({ jwt }),

  setIsFetching: (isFetching: boolean) => set({ isFetching }),

  resetAuthError: () => set({ authError: "" }),

  signin: async (payload: any) => {},

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
}));

export default useAuthStore;
