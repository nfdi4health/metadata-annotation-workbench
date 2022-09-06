import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MainPage } from "./pages/MainPage";
import { createInstance, MatomoProvider } from "@datapunt/matomo-tracker-react";
import { EuiProvider } from "@elastic/eui";
import "@elastic/eui/dist/eui_theme_light.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const instance = createInstance({
  urlBase: "https://books.publisso.de/matomo/",
  trackerUrl: "https://books.publisso.de/matomo/matomo.php", // optional, default value: `${urlBase}matomo.php`
  srcUrl: "https://books.publisso.de/matomo/matomo.js", // optional, default value: `${urlBase}matomo.js`
  siteId: 9,
  linkTracking: false, // Important!
});

function App() {
  return (
    <div>
      <MatomoProvider value={instance}>
        <QueryClientProvider client={queryClient}>
          <EuiProvider colorMode="light">
            <MainPage />
          </EuiProvider>
        </QueryClientProvider>
      </MatomoProvider>
    </div>
  );
}

export default App;
