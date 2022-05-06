import React, { Suspense } from "react";
import { createBrowserHistory } from "history";
import "./App.scss";
import RootWrapper from "wrappers/RootWrapper";
import { Router } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";

export const history = createBrowserHistory();
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 24 * 3600 * 1000, // cache for 1 day
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={client}>
      <Router history={history}>
        <Suspense fallback={null}>
          <RootWrapper />
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
