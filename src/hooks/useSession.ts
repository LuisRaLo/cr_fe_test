import { useEffect } from "react";
import { IAuthenticationState } from "../store/AuthStore";
import { ILocalStorage } from "./useLocalStorage";

export default function useSession(
  authStore: IAuthenticationState,
  localStorage: ILocalStorage
) {
  useEffect(() => {
    const jwt = localStorage.getLocalStorage("jwt");

    if (jwt) {
      authStore.setJWT(jwt);
    } else {
      if (authStore.jwt) {
        localStorage.setLocalStorage("jwt", authStore.jwt);

        return;
      }

      localStorage.removeLocalStorage("jwt");
      authStore.setJWT(null);
    }
  }, []);

  useEffect(() => {
    if (authStore.jwt === null) {
      localStorage.removeLocalStorage("jwt");
    }
  }, [authStore.jwt, localStorage]);

  return {
    jwt: authStore.jwt,
  };
}
