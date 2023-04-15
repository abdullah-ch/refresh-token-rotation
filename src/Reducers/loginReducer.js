export const ACTIONS = {
  CALL_API: 'call-api',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const loginReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.CALL_API: {
      return {
        ...state,
        loading: true,
      };
    }
    case ACTIONS.SUCCESS: {
      return {
        ...state,
        loading: false,
        userDetails: action.data,
      };
    }
    case ACTIONS.ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    default:
      return { ...state };
    // code block
  }
};
