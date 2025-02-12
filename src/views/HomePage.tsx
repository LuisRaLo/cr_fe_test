import { signOut } from "aws-amplify/auth";
import useAuthStore from "../store/AuthStore";

export default function HomePage(): JSX.Element {
  const authStore = useAuthStore((state) => state);

  async function handleSignOut() {
    console.log("session: ", authStore.session);

    await signOut();

    console.log("signed out, session: ", authStore.session);
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Home Page</h1>

      <p className="mt-4">
        Welcome{authStore.session?.tokens?.idToken?.payload?.name?.toString()}{" "}
      </p>
      <p className="mt-4">
        {authStore.session?.tokens?.idToken?.payload?.email?.toString()} |{" "}
        {authStore.session?.userSub}
      </p>

      <button
        type="button"
        onClick={handleSignOut}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Logout
      </button>
    </main>
  );
}
