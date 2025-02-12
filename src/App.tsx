import { Fragment } from "react";
import useAuthStore from "./store/AuthStore";
import RouterComponent from "./routes";
import SpinnerComponent from "./components/SpinnerComponent";
import "@aws-amplify/ui-react/styles.css";

import "./assets/styles/app.css";

function App(): JSX.Element {
  const authStore = useAuthStore((state) => state);

  return (
    <Fragment>
      <RouterComponent idToken={authStore.jwt} />

      <SpinnerComponent show={authStore.isFetching} />
    </Fragment>
  );
}

export default App;
