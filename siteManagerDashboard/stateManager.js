
// // State Management
const createStore = (startState = {}) => {
    let state = startState;
    const setState = (newState) => { 
      state = {...state, ...newState}
    }
    const getState = () => { return state }
    return {
      setState,
      getState,
    };
  }
  


export const appState = createStore();