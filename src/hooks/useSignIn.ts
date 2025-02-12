import { FormEvent, useEffect, useState } from "react";
import { IAuthenticationState } from "../store/AuthStore";

export type SignInRequest = {
  user: string;
  password: string;
};

export type SignIn = {
  authentication_result: {
    AccessToken: string;
    ExpiresIn: number;
    IdToken: string;
    RefreshToken: string;
    TokenType: string;
  };
  retry_attempts: number;
};

export type SignInResponse = {
  mensaje: string;
  resultado: SignIn;
};

export type SignInMFA = {
  challenge_name: string;
  session: string;
  retry_attempts: number;
};

export type SignInMFAResponse = {
  mensaje: string;
  resultado: SignInMFA;
};

export default function useSignIn(authStore: IAuthenticationState) {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [signInRequest, setSignInRequest] = useState<SignInRequest>({
    user: "creze.test2@yopmail.com",
    password: "Holamundo1.",
  });

  const [isValidateSignInRequest, setIsValidateSignInRequest] =
    useState<boolean>(false);

  function validateSignInRequest(signInRequest: SignInRequest): boolean {
    if (signInRequest.user && signInRequest.password) {
      return true;
    }

    return false;
  }

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    authStore.signin(signInRequest);
  };

  useEffect(() => {
    if (validateSignInRequest(signInRequest)) {
      setIsValidateSignInRequest(true);
    }
  }, [signInRequest]);

  return {
    signInRequest,
    isShowPassword,
    isValidateSignInRequest,

    setSignInRequest,
    setIsShowPassword,
    handleSubmit,
  };
}
