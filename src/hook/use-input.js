import { useReducer, useCallback } from "react";

const useInput = (initValue, validateFunction = null) => {
  const initState = {
    value: initValue,
    isValueValid: false,
    isFocus: false,
  };

  const valueReducer = (preState, action) => {
    if (action.type === "INPUT") {
      return {
        value: action.value,
        isValueValid: !validateFunction || validateFunction(action.value),
        isFocus: true,
      };
    }

    return initState;
  };

  const [valueState, dispatchValue] = useReducer(valueReducer, initState);

  const inputOnChange = useCallback(
    (value) => {
      dispatchValue({
        type: "INPUT",
        value: value,
      });
    },
    [dispatchValue]
  );

  return { valueState, inputOnChange };
};

export default useInput;
