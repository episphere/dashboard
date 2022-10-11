
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
  
  
  
//   let filters={name: 'John', age: 30};
  
  
  
//   appState.setState({filters, name: 'John', age: 30});
  
//   console.log(appState.getState());
  
  
  
//   filters={name: 'mike', age: 60};
  
//   appState.setState({filters, users:{name: 'mike', age: 60}});
  
//   console.log(appState.getState());
  
  
  
//   appState.setState({filters:{}});
  
//   console.log(appState.getState());