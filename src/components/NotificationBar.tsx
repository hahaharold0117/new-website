import React, { memo, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Link,
  Outlet,
  Params,
  useMatches,
} from "react-router-dom";

function BreadcrumbComponent() {
  const matches = useMatches();

  const crumbs = useMemo(() => {
    return matches
      .filter((m) => m.handle !== undefined && !!m.handle)
      .filter((m) => Object.hasOwn(m.handle as object, "crumb"))
      .map((m) => ({
        id: m.id,
        params: m.params,
        crumb: (
          m.handle as { crumb: (p: Params<string>) => React.ReactElement }
        ).crumb,
        pathname: m.pathname,
      }));
  }, [matches]);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {crumbs.map((m, idx) => (
          <React.Fragment key={idx}>
            <BreadcrumbItem>
              {
                <BreadcrumbLink asChild>
                  <Link to={m.pathname}>{m.crumb(m.params)}</Link>
                </BreadcrumbLink>
              }
            </BreadcrumbItem>

            {idx + 1 < crumbs.length && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const NotificationBar = () => {
  return (
    <div className="p-4 lg:p-8 lg:pt-6 mx-auto">
      <BreadcrumbComponent />
      <Outlet />
    </div>
  );
};

export default memo(NotificationBar);
