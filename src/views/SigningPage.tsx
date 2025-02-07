import { FormEvent, useState } from "react";
import useAuthStore from "../store/AuthStore";

export default function SigningPage(): JSX.Element {
  const authStore = useAuthStore((state) => state);
  const [email, setEmail] = useState<string>("creze.test2@yopmail.com");
  const [password, setPassword] = useState<string>("Holamundo1.");
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.form as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    authStore.signin(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full sm:max-w-lg bg-white rounded-lg shadow md:mt-0 xl:p-0 border-2 border-gray-300">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Sign in to your account
          </h1>

          <form className="space-y-4 md:space-y-6" action="#">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Your email
              </label>

              <input
                type="email"
                name="email"
                id="email"
                onInput={(e) => setEmail(e.currentTarget.value)}
                value={email}
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
                onInput={(e) => setPassword(e.currentTarget.value)}
                value={password}
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
              className="w-full focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
  );
}
