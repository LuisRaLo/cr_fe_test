import useAuthStore from "../store/AuthStore";
import { useState } from "react";
import TabContentComponent from "../components/TabContentComponent";

export default function HomePage(): JSX.Element {
  const authStore = useAuthStore((state) => state);

  const [open, setOpen] = useState<string>("home");

  const handleTabOpen = (tabCategory: string) => {
    setOpen(tabCategory);
  };

  async function handleSignOut() {
    authStore.signout();
  }

  return (
    <main>
      <section className="py-20 lg:py-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mb-14 w-full">
                <div className="flex flex-col flex-wrap rounded-lg border border-[#E4E4E4] px-4 py-3 dark:border-dark-3 sm:flex-row">
                  <button
                    onClick={() => handleTabOpen("home")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium md:text-base lg:px-6 ${
                      open === "home"
                        ? "bg-primary text-blue-900"
                        : "text-body-color hover:bg-blue-900 hover:text-white dark:text-dark-6 "
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleTabOpen("settings")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium md:text-base lg:px-6 ${
                      open === "settings"
                        ? "bg-primary text-blue-900"
                        : "text-body-color hover:bg-blue-900 hover:text-white dark:text-dark-6 "
                    }`}
                  >
                    Settings
                  </button>
                </div>
                <TabContentComponent tabCategory="home" open={open}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Officia nisi, doloribus nulla cumque molestias corporis eaque
                  harum vero! Quas sit odit optio debitis nulla quisquam,
                  dolorum quaerat animi iusto quod.
                </TabContentComponent>

                <TabContentComponent tabCategory="settings" open={open}>
                  <p>Signed in as: </p>

                  <button
                    onClick={handleSignOut}
                    className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-md"
                  >
                    Sign Out
                  </button>
                </TabContentComponent>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
