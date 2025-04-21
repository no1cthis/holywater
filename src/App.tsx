import {
  useNotificationProvider
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import {
  Refine
} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier
} from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp } from "antd";
import { BrowserRouter } from "react-router";

import { ResourceRoutes } from "./components/resource-routes";
import { ColorModeContextProvider } from "./providers/color-mode-provider";
import { resources } from "./routing/resources";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
              <Refine
                dataProvider={dataProvider("http://localhost:3001/api")}
                notificationProvider={useNotificationProvider}
                options={{
                  redirect: {
                    afterCreate: "list",
                    afterEdit: "list",
                  },
                  syncWithLocation: true,
                  useNewQueryKeys: true,
                  warnWhenUnsavedChanges: true
                }}
                resources={resources}
                routerProvider={routerBindings}
              >
                
                    <ResourceRoutes/>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}
export default App;

