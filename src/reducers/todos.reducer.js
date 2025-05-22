/*
    Collection of string constants that correspond to:
    state setters (setIsLoading, setTodoList, setErrorMessage, setIsSaving)
    variables that hold todo data (newTodo, savedTodo, editedTodos, etc.)
    special actions (errorMessage for the dismiss button)
*/ 
const actions = {
    // from useEffect fetchTodos 
    setIsLoading: 'setIsLoading',
    setTodoList: 'setTodoList',
    setErrorMessage: 'setErrorMessage',

    // from handleAddTodo
    setIsSaving: 'setIsSaving',
    newTodo: 'newTodo',
    savedTodo: 'savedTodo',
    
    
    // from updateTodo
    editedTodos: 'editedTodos',
    updatedTodos: 'updatedTodos',
    revertedTodos: 'revertedTodos',
    
    // from completeTodo
    refreshTodos: 'refreshTodos',
    
    // from error dismiss
    errorMessage: 'errorMessage',
}

// Starting values for all of the states that will be managed by the reducer
const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    error: ' ',
};

/*
    Reducer Function:
    -Takes current state (defaults to initialState on first call)
    -Takes action object that describes what happened
    -Returns a new state object

    Switch Statement:
    -evaluates action.type and returns a new state:
        -Simple state updates (setIsLoading, setTodoList, etc.)
        -todo array updates (newTodo & savedTodo) adds a new todo to the existing array 
        -replaces the entire todoList with a new array like mapping over todos to update one
        (editedTodos, updatedTodos, etc.)
*/ 
function todoReducer (state = initialState, action) {
    switch (action.type) {
        case actions.setIsLoading:
            return {
                ...state,
                //handles direct state changes - setIsLoading(true) or setIsLoading(false)
                isLoading: action.value, 
            };
        case actions.setTodoList:
            return {
                ...state,
                todoList: action.value,
            };  
        case actions.setErrorMessage:
        return {
            ...state,
            errorMessage: action.value,
        };
        case actions.setIsSaving:
            return {
                ...state,
                isSaving: action.value,
            };
        case actions.newTodo:
            return {
                ...state,
                todoList: [...state.todoList, action.newTodo],
            };
        case actions.savedTodo:
            return {
                ...state,
                todoList: [...state.todoList, action.savedTodo],
            };
       case actions.editedTodos:
            return {
                ...state,
                todoList: action.editedTodos,
            };
        case actions.updatedTodos:
            return {
                ...state,
                todoList: action.updatedTodos,
            };
        case actions.revertedTodos:
            return {
                ...state,
                todoList: action.revertedTodos,
            };
        case actions.refreshTodos:
            return {
                ...state,
                todoList: action.refreshTodos,
            };
        case actions.errorMessage: 
            return {
                ...state,
                errorMessage: '',
            };
        default:
            return state;
    }
}

export { initialState, actions, todoReducer };