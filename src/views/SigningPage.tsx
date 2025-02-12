import useAuthStore from "../store/AuthStore";
import useSignIn from "../hooks/useSignIn";
import { Fragment } from "react/jsx-runtime";
import ModalComponent from "../components/ModalComponent";
import { useEffect, useState } from "react";

export default function SigningPage(): JSX.Element {
  const authStore = useAuthStore((state) => state);

  const {
    setIsShowPassword,
    setSignInRequest,
    handleSubmit,
    isShowPassword,
    signInRequest,
    isValidateSignInRequest,
  } = useSignIn(authStore);

  const [challengeModal, setChallengeModal] = useState<boolean>(false);
  const [mfaCode, setMFACode] = useState<string>("");

  async function handleVerifyMFA() {
    await authStore.verifyMFA(signInRequest.user, mfaCode);
  }

  useEffect(() => {
    authStore.session && Object.keys(authStore.session).includes("session")
      ? setChallengeModal(true)
      : setChallengeModal(false);
  }, [authStore.session]);

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
                  onInput={(e) =>
                    setSignInRequest({
                      ...signInRequest,
                      user: e.currentTarget.value,
                    })
                  }
                  value={signInRequest.user}
                  className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="email or phone"
                  required
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium "
                >
                  Password
                </label>
                <input
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  onInput={(e) => {
                    setSignInRequest({
                      ...signInRequest,
                      password: e.currentTarget.value,
                    });
                  }}
                  value={signInRequest.password}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-10"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="/"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-900 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-3 focus:ring-primary-300"
                disabled={!isValidateSignInRequest}
                onClick={handleSubmit}
              >
                Sign in
              </button>
              <p className="text-sm font-light">
                Don’t have an account yet?{" "}
                <a
                  href="/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <ModalComponent
        isOpen={challengeModal}
        title="Confirm"
        onClose={() => setChallengeModal(false)}
      >
        <div>
          <p className="text-sm font-light">
            To continue, we need to confirm your identity. Please enter the mfa
          </p>
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            name="code"
            id="code"
            onInput={(e) => {
              setMFACode(e.currentTarget.value);
            }}
            value={mfaCode}
            maxLength={6}
            className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="code"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleVerifyMFA}
            className="w-full flex items-center justify-center text-white bg-blue-900 hover:bg-primary-700 disabled:bg-primary-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Confirm
          </button>
        </div>
      </ModalComponent>
    </Fragment>
  );
}
