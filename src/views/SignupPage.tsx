import { Fragment, useEffect } from "react";
import useAuthStore from "../store/AuthStore";
import SpinnerComponent from "../components/SpinnerComponent";
import ModalComponent from "../components/ModalComponent";
import useSignUp from "../hooks/useSignUp";

export default function SignupPage(): JSX.Element {
  const authStore = useAuthStore((state) => state);

  const {
    signUpRequest,
    confirmSignUpRequest,
    isValidateConfirmSignUpRequest,
    isValidateSignUpRequest,
    setSignUpRequest,
    setConfirmSignUpRequest,
    handleConfirm,
    handleSubmit,
  } = useSignUp(authStore);

  useEffect(() => {
    if (authStore.authStep === "CONFIRMED_SIGN_UP") {
      window.location.href = "/signin";
    }
  }, [authStore.authStep]);

  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full sm:max-w-lg bg-white rounded-lg shadow md:mt-0 xl:p-0 border-2 border-gray-300">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
              Sign in to your account
            </h1>

            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium"
                >
                  Your email
                </label>

                <input
                  type="email"
                  name="email"
                  id="email"
                  onInput={(e) => {
                    setSignUpRequest({
                      ...signUpRequest,
                      email: e.currentTarget.value,
                    });

                    setConfirmSignUpRequest({
                      ...confirmSignUpRequest,
                      email: e.currentTarget.value,
                    });
                  }}
                  value={signUpRequest.email}
                  className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="email or phone"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
                  name
                </label>

                <input
                  type="text"
                  name="name"
                  id="email"
                  onInput={(e) =>
                    setSignUpRequest({
                      ...signUpRequest,
                      name: e.currentTarget.value,
                    })
                  }
                  value={signUpRequest.name}
                  className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium "
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onInput={(e) =>
                    setSignUpRequest({
                      ...signUpRequest,
                      password: e.currentTarget.value,
                    })
                  }
                  value={signUpRequest.password}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium "
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  onInput={(e) =>
                    setSignUpRequest({
                      ...signUpRequest,
                      repeatPassword: e.currentTarget.value,
                    })
                  }
                  value={signUpRequest.repeatPassword}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!isValidateSignUpRequest}
                className="w-full text-white bg-blue-900 hover:bg-primary-700 disabled:bg-primary-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Register
              </button>
              <p className="text-sm font-light">
                I have an account{" "}
                <a
                  href="/"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500 underline"
                >
                  Sign In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <SpinnerComponent show={authStore.isFetching} />

      <ModalComponent
        isOpen={authStore.showModalToConfirm}
        title="Confirm"
        onClose={() => authStore.setShowModalToConfirm(false)}
      >
        <div>
          <p className="text-sm font-light">
            To continue, we have sent a confirmation code to your email. Please
            enter the code below.
          </p>
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            name="code"
            id="code"
            onInput={(e) =>
              setConfirmSignUpRequest({
                ...confirmSignUpRequest,
                code: e.currentTarget.value,
              })
            }
            value={confirmSignUpRequest.code}
            maxLength={6}
            className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="code"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => handleConfirm()}
            disabled={!isValidateConfirmSignUpRequest}
            className="w-full flex items-center justify-center text-white bg-blue-900 hover:bg-primary-700 disabled:bg-primary-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Confirm
          </button>
        </div>
      </ModalComponent>

      <ModalComponent
        isOpen={authStore.authError !== ""}
        onClose={() => authStore.resetAuthError()}
      >
        <div>
          <p className="text-sm font-light">{authStore.authError}</p>
        </div>
      </ModalComponent>
    </Fragment>
  );
}
