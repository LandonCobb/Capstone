import * as React from "react";

/**
 * Use a more simple state to clean up components
 * @param initState Initial state
 * @param log Log state as it changes
 * @returns [state, set, reset]
 */
const useSimpleState = <State,>(
  initState: State,
  log = false
): [
  state: State,
  set: <K extends keyof State>(items: K[], vals: State[K][]) => void,
  reset: <K extends keyof State>(items?: K[]) => void
] => {
  const [state, setState] = React.useState(initState);
  const shouldLog = React.useMemo(() => log, [log])

  React.useEffect(() => {
    setState(initState);
  }, [initState]);

  /**
   * Sets the simple state
   * @param items Items to set
   * @param vals Values to set to item
   */
  const set = React.useCallback(
    <K extends keyof State>(items: K[], vals: State[K][]) =>
      setState((s) => {
        const newState = items.reduce(
          (prev, curr, i) => ({ ...prev, [curr]: vals[i] }),
          {}
        );
        shouldLog && console.log("SET STATE", newState);
        return { ...s, ...newState };
      }),
    [shouldLog]
  );

  /**
   * Resets state back to init
   * @param items items to reset back to init values. if ommited it resets all values
   */
  const reset = React.useCallback(
    <K extends keyof State>(items?: K[]) => {
      shouldLog &&
        console.log(
          "RESET STATE",
          items ? items.map((key) => initState[key]) : initState
        );
      items
        ? set(
            items,
            items.map((key) => initState[key])
          )
        : setState(initState);
    },
    [initState, shouldLog, set]
  );

  return [state, set, reset];
};

export default useSimpleState;
