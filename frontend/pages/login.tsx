import React, { ReactElement } from "react";

type Props = {};

function Login({}: Props) {
  return <div>login</div>;
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Login;
