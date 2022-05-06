// import { setResourceI18n } from "helper/i18n";
import React, { lazy } from "react";
import { Route, Switch } from "react-router-dom";
import AuthWrapper from "wrappers/AuthWrapper";

const Login = lazy(() => import("pages/Login"));

export default function AppWrapper() {
  return (
    <div className="root-wrapper">
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/" component={AuthWrapper} />
      </Switch>
    </div>
  );
}
