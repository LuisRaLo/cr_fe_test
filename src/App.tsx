import { Fragment } from "react";

import RouterComponent from "./routes";
import SpinnerComponent from "./components/SpinnerComponent";

import "./assets/styles/app.css";

import useAuthStore from "./store/AuthStore";

function App(): JSX.Element {
  const authStore = useAuthStore((state) => state);

  return (
    <Fragment>
      <RouterComponent idToken={authStore.token} />

      <SpinnerComponent show={authStore.isFetching} />
    </Fragment>
  );
}

export default App;
