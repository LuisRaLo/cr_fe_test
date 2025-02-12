import { useEffect, useState } from "react";

export type SignUpRequest = {
  email: string;
  name: string;
  password: string;
  repeatPassword: string;
};

export type ConfirmSignUpRequest = {
  email: string;
  code: string;
};

export default function useSignUp() {
  const [signUpRequest, setSignUpRequest] = useState<SignUpRequest>({
    email: "creze.test2@yopmail.com",
    name: "TEST " + (Math.random() * 1000).toFixed(0),
    password: "Holamundo1.",
    repeatPassword: "Holamundo1.",
  });

  const [confirmSignUpRequest, setConfirmSignUpRequest] =
    useState<ConfirmSignUpRequest>({
      email: signUpRequest.email,
      code: "",
    });

  const [isValidateSignUpRequest, setIsValidateSignUpRequest] =
    useState<boolean>(false);
  const [isValidateConfirmSignUpRequest, setIsValidateConfirmSignUpRequest] =
    useState<boolean>(false);

  function validateSignUpRequest(signUpRequest: SignUpRequest): boolean {
    if (
      signUpRequest.email &&
      signUpRequest.name &&
      signUpRequest.password &&
      signUpRequest.repeatPassword
    ) {
      return true;
    }

    return false;
  }

  function validateConfirmSignUpRequest(
    confirmSignUpRequest: ConfirmSignUpRequest
  ): boolean {
    if (confirmSignUpRequest.email && confirmSignUpRequest.code) {
      return true;
    }

    return false;
  }

  useEffect(() => {
    if (validateSignUpRequest(signUpRequest)) {
      setIsValidateSignUpRequest(true);
    }
  }, [signUpRequest]);

  useEffect(() => {
    if (validateConfirmSignUpRequest(confirmSignUpRequest)) {
      setIsValidateConfirmSignUpRequest(true);
    }
  }, [confirmSignUpRequest]);

  return {
    signUpRequest,
    confirmSignUpRequest,
    isValidateSignUpRequest,
    isValidateConfirmSignUpRequest,

    setSignUpRequest,
    setConfirmSignUpRequest,
    setIsValidateSignUpRequest,
    setIsValidateConfirmSignUpRequest,
  };
}
