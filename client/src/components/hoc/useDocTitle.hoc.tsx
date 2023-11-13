import * as React from "react";

/**
 * Adds a custom doc title when the component renders
 * @param title
 * @param Component
 */
export const withDocTitle =
  <P extends object>(title: string, Component: React.ComponentType<P>) =>
  (props: P): React.ReactNode => {
    React.useEffect(() => {
      document.title =
        "Rally | " + title + (import.meta.env.DEV ? " (local)" : "");
    }, []);
    return <Component {...props} />;
  };
