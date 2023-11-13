import * as React from "react";
import { Auth } from "aws-amplify";
import * as T from "@/types";
import * as Util from "@/util";

interface State {
  isAuthenticated: boolean;
  loading: boolean;
  user?: T.User;
}

interface Functions {
  refreshUser: () => Promise<void>;
}

enum Actions {
  SET_USER,
  SET_LOADING,
}

type Action = { type: Actions; payload?: Partial<State> };

const initState: State = {
  isAuthenticated: false,
  loading: true,
};

const AppContext = React.createContext<(State & Functions) | null>(null);

/**
 * Takes the old state and updates it with new state
 */
const reducer = (state = initState, action: Action): State => {
  console.log("[APP-CONTEXT]", Actions[action.type], action.payload);
  return { ...state, ...action.payload };
};

export const AppStore: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(reducer, initState);

  /**
   * Gets the user data from the AWS Auth api
   * @note the `React.useCallback` definition wraps an generic arrow function with a dependacy array
   */
  const getUserData = React.useCallback(async () => {
    const payload: Partial<State> = {};
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (!user) throw new Error("User is not Authenticated");
      const attributes = await Auth.userAttributes(user);
      payload.user = Util.parseUserToJSTypes(attributes);
      payload.isAuthenticated = true;
    } catch {
      payload.isAuthenticated = false;
      payload.user = undefined;
    }
    dispatch({ type: Actions.SET_USER, payload });
  }, []);

  /**
   * Sets the loading state of the app
   */
  const setLoading = React.useCallback(
    (loading: boolean) =>
      dispatch({ type: Actions.SET_LOADING, payload: { loading } }),
    []
  );

  /**
   * Refreshes the user
   */
  const refreshUser = React.useCallback(async () => {
    setLoading(true);
    await getUserData();
    setLoading(false);
  }, [getUserData, setLoading]);

  React.useEffect(() => {
    const init = async () => {
      Util.amplify();
      refreshUser();
    };
    init();
  }, [refreshUser]);

  React.useEffect(() => {
    if (state.isAuthenticated) {
      const getToken = async () => {
        try {
          const session = await Auth.currentSession();
          if (session) {
            console.log("Access:", session.getAccessToken().getJwtToken());
            // console.log("Id:", session.getIdToken().getJwtToken());
          } else console.log("No Session");
        } catch {} // eslint-disable-line no-empty
      };
      getToken();
    }
  }, [state.isAuthenticated]);

  return (
    <AppContext.Provider value={{ ...state, refreshUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
