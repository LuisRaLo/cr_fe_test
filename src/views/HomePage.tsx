import useAuthStore from "../store/AuthStore";
import { Fragment, useState } from "react";
import TabContentComponent from "../components/TabContentComponent";
import ModalComponent from "../components/ModalComponent";
import { SignIn } from "../hooks/useSignIn";

export default function HomePage(): JSX.Element {
  const authStore = useAuthStore((state) => state);

  const [section, setSection] = useState<string>("home");
  const [mfaConfig, setMFAConfig] = useState<boolean>(false);
  const [mfaType, setMFAType] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [mfaCode, setMFACode] = useState<string>("");
  const [mfaSecret, setMFASecret] = useState<string>("");

  const handleTabOpen = (tabCategory: string) => {
    setSection(tabCategory);
  };

  async function handleConfirmMFA() {
    const confirmMFA = await authStore.confirmMFA({
      mfa_code: mfaCode,
      access_token: (authStore.session as SignIn)?.authentication_result
        .AccessToken,
    });

    console.log("Confirm MFA", confirmMFA);
  }

  async function handleMFASecret() {
    setShowQRCode(true);

    const getMFASecret = await authStore.getMFASecret();

    if (getMFASecret) {
      const uri =
        "otpauth://totp/CrezeApp:" +
        authStore.session?.retry_attempts +
        "?secret=" +
        getMFASecret +
        "&issuer=MiApp";

      const qr_url =
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + uri;

      setMFASecret(qr_url);
    }
  }

  return (
    <Fragment>
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
                        section === "home"
                          ? "bg-primary text-blue-900"
                          : "text-body-color hover:bg-blue-900 hover:text-white dark:text-dark-6 "
                      }`}
                    >
                      Home
                    </button>
                    <button
                      onClick={() => handleTabOpen("settings")}
                      className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium md:text-base lg:px-6 ${
                        section === "settings"
                          ? "bg-primary text-blue-900"
                          : "text-body-color hover:bg-blue-900 hover:text-white dark:text-dark-6 "
                      }`}
                    >
                      Settings
                    </button>
                  </div>
                  <TabContentComponent tabCategory="home" open={section}>
                    <h1 className="text-2xl font-semibold text-center dark:text-dark-6">
                      Welcome to Luis' Test App
                    </h1>

                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                      <button
                        type="button"
                        onClick={() => authStore.signout()}
                        className="flex items-center justify-center text-white bg-blue-900 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                      >
                        Sign Out
                      </button>
                    </div>
                  </TabContentComponent>

                  <TabContentComponent tabCategory="settings" open={section}>
                    <table aria-hidden="true" className="w-full table-auto">
                      <tbody>
                        <tr>
                          <td className="py-2">Name</td>
                          <td className="py-2">John Doe</td>
                        </tr>
                        <tr>
                          <td className="py-2">MFA Status</td>
                          <td className="py-2">
                            {authStore.challengeName.length > 0 ? (
                              <span className="text-red-500">
                                {JSON.stringify(authStore.challengeName)}
                              </span>
                            ) : (
                              <button
                                onClick={() => setMFAConfig(true)}
                                className="text-primary underline hover:text-blue-900 dark:text-dark-6"
                              >
                                Configure MFA
                              </button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">Email</td>
                          <td className="py-2">cre***@yopmail.com</td>
                        </tr>
                      </tbody>
                    </table>
                  </TabContentComponent>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ModalComponent
        isOpen={mfaConfig}
        title="Confirm"
        onClose={() => setMFAConfig(false)}
      >
        <div>
          <p className="text-sm font-light">
            To continue, please select a method to configure MFA.
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setMFAType("authenticator")}
            className="w-full flex items-center justify-center text-white bg-blue-900 hover:bg-blue-700 disabled:bg-primary-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Authenticator app
          </button>

          <button
            type="button"
            onClick={() => setMFAType("sms")}
            disabled={true}
            className="w-full flex items-center justify-center text-white bg-blue-900 hover:bg-primary-700 disabled:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            SMS
          </button>

          <button
            type="button"
            disabled
            onClick={() => setMFAType("email")}
            className="w-full flex items-center justify-center text-white bg-blue-900 hover:bg-primary-700 disabled:bg-blue-200  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Email
          </button>
        </div>

        {mfaType === "authenticator" && (
          /* 
            instrucciones: 
            1: Install a compatible application such as Google Authenticator, Duo Mobile, or Authy app on your mobile device or computer.
            2: Open the application and scan the QR code or enter the provided key.
            3: Type two consecutive MFA codes below to confirm.
          */
          <div className="mt-4">
            <div className="text-sm font-light text-left mt-4">
              <span className="font-bold">1.</span> Install a compatible
              application such as Google Authenticator, Duo Mobile, or Authy app
              on your mobile device or computer.
            </div>
            <div className="text-sm font-light text-left mt-4">
              <span className="font-bold">2.</span> Open the application and
              scan the QR code or enter the provided key.
              <div className="flex justify-center mt-4">
                {!showQRCode ? (
                  <button
                    type="button"
                    onClick={() => handleMFASecret()}
                    className="h-40 w-40 bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-primary-300 rounded-lg"
                  >
                    <span className="underline">Show QR Code</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center">
                    <img src={mfaSecret} alt="QR Code" className="h-40 w-40" />

                    <button
                      type="button"
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="underline text-primary-600 hover:text-primary-700 mt-2"
                    >
                      Hide QR Code
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm font-light text-left mt-10">
              <span className="font-bold">3.</span> Type the MFA code below to
              confirm.
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={6}
                  minLength={6}
                  className="w-full mt-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-primary-300 focus:outline-none px-4 py-2.5"
                  placeholder="MFA Code"
                  value={mfaCode}
                  onChange={(e) => setMFACode(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleConfirmMFA}
            disabled={!(mfaType && mfaCode.length === 6)}
            className="w-full flex items-center justify-center text-white bg-blue-900 hover:bg-primary-700 disabled:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Confirm
          </button>
        </div>
      </ModalComponent>
    </Fragment>
  );
}
