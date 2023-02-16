// // State Management
const createStore = (startState = {}) => {
    let state = JSON.parse(JSON.stringify(startState));
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