import { FormEvent, useState } from "react";
import useAuthStore from "../store/AuthStore";

export default function SignupPage(): JSX.Element {
  const authStore = useAuthStore((state) => state);
  const [email, setEmail] = useState<string>("creze.test2@yopmail.com");
  const [password, setPassword] = useState<string>("Holamundo1.");
  const [repeatPassword, setRepeatPassword] = useState<string>("Holamundo1.");
  const [name, setName] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    authStore.signup(email, password, repeatPassword, name);
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
                Your email or phone
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

            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                name
              </label>

              <input
                type="text"
                name="name"
                id="email"
                onInput={(e) => setName(e.currentTarget.value)}
                value={name}
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
                onInput={(e) => setPassword(e.currentTarget.value)}
                value={password}
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
                onInput={(e) => setRepeatPassword(e.currentTarget.value)}
                value={repeatPassword}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full text-white bg-blue-900 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
  );
}
