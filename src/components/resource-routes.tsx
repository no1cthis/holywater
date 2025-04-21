import { ErrorComponent, ThemedLayoutV2, ThemedSiderV2 } from "@refinedev/antd";
import { type IResourceItem, type ResourceRouteDefinition, useResource } from "@refinedev/core";
import { Outlet, Route, Routes } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

import { NavigateToResource } from "@refinedev/react-router";
import { Header } from "./layout/header";

export const ResourceRoutes: React.FC = () => {
  const { resources } = useResource();

  return (
    <Routes>
      <Route
        element={
          <ThemedLayoutV2
            Header={() => <Header sticky />}
            Sider={(props) => <ThemedSiderV2 {...props} fixed />}
          >
            <Outlet />
          </ThemedLayoutV2>
        }
      >
        {resources.map((resource: IResourceItem) => {
          const list = resource.list as ResourceRouteDefinition;
          const create = resource.create as ResourceRouteDefinition;
          const edit = resource.edit as ResourceRouteDefinition;
          const show = resource.show as ResourceRouteDefinition;

          return (
            <Fragment key={resource.name}>
              {list && <Route element={<list.component />} path={list.path} />}
              {create && <Route element={<create.component />} path={create.path} />}
              {edit && <Route element={<edit.component />} path={edit.path} />}
              {show && <Route element={<show.component />} path={show.path} />}
            </Fragment>
          );
        })}
        <Route element={<NavigateToResource resource={resources[0].name}/>} path="/" />
        <Route element={<ErrorComponent />} path="*" />
      </Route>
    </Routes>
  );
}; 
