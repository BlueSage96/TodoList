/*
    Collection of string constants that correspond to:
    state setters (setIsLoading, setTodoList, setErrorMessage, setIsSaving)
    variables that hold todo data (newTodo, savedTodo, editedTodos, etc.)
    special actions (errorMessage for the dismiss button)
*/ 
const actions = {
    // from useEffect fetchTodos 
    fetchTodos: 'fetchTodos',

    // from handleAddTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    setLoadError: 'setLoadError',
    
    // from updateTodo
    loadTodos: 'loadTodos',
    completeTodos: 'completeTodos',
    updateTodos: 'updateTodos',
    revertTodos: 'revertTodos',
    
    // from completeTodo
    refreshTodos: 'refreshTodos',
    
    // from error dismiss
    clearError: 'clearError',
}

// Starting values for all of the states that will be managed by the reducer
const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: ' ',
};

/*
    Reducer Function:
    -Takes current state (defaults to initialState on first call)
    -Takes action object that describes what happened
    -Returns a new state object

    Switch Statement:
    -evaluates action.type and returns a new state:
       **update
*/ 
function todoReducer (state = initialState, action) {
    switch (action.type) {  
        case actions.fetchTodos:
            return {
                ...state,
                isLoading: true,
            };
        case actions.startRequest:
            return {
                ...state,
                isSaving: true,
            };
        case actions.addTodo:
            return {
                ...state,
                // savedTodo logic inline w/o declaring a variable
                todoList: [...state.todoList, action.savedTodo, {
                    id: action.records[0].id,
                    ...action.records[0].fields,
                    isCompleted: action.records[0].fields.isCompleted || false,
                }],
                isSaving: false,
            };
        case actions.endRequest:
            return {
                ...state,
                isLoading: false,
                isSaving: false,
            };
        case actions.setLoadError:
            return {
                errorMessage: action.error.message,
                isLoading: false,
            }
        case actions.loadTodos:
            return {
                ...state,
                todoList: action.records.map((record) => {
                    const todo = {
                        id: record.id,
                        ...record.fields,
                        title: record.fields.title,
                        isCompleted: record.fields.isCompleted,
                    };
                    if(!todo.isCompleted) {
                        //if isCompleted isn't true, set it to false
                        todo.isCompleted = false;
                    };
                    return todo;
                }),
                isLoading: false,
            };
       case actions.completeTodos:
            return {
                ...state,
                todoList: action.completeTodos,
            };
        case actions.updateTodos:
            return {
                ...state,
                todoList: action.updateTodos,
            };
        case actions.revertTodos:
            return {
                ...state,
                todoList: action.revertTodos,
            };
 
        case actions.clearError: 
            return {
                ...state,
                errorMessage: '',
            };
        default:
            return state;
    }
}

export { initialState, actions, todoReducer };