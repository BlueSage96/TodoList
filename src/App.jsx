import "./App.css";
import { useState, useEffect, useCallback, useReducer } from "react";
import TodoList from "./features/Todolist/TodoList";
import AddTodoForm from "./features/TodoForm";
import ViewForm from "./features/TodosViewForm";
import StyledApp from './App.module.css';

import {
  todoReducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [todoList, setTodoList] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  /*
    Arguments: sortField, sortDirection, baseUrl, quearyString
    Enhanced url sorting and filtering (querying)
    Returns a template literal that appends the query parameters to url
    **Adding encodeURL() around template literal causes error: "maximum call stack size exceeded"
    Replaces url in the fetch lines belows
  */
  const encodeURL = useCallback(() => {
    let searchQuery = "";
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    if (queryString){
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return `${baseUrl}?${sortQuery}${searchQuery}`;
  }, [baseUrl,queryString,sortDirection,sortField]);

  //make an async function to fetch todos from Airtable API and call in the below functions
  const syncTodos = async (todo) => {
    const payload = {
      records: [
        {
          id: todo.id,
          fields: {
            title: todo.title,
            isCompleted: todo.isCompleted,
          },
        },
      ],
    };
    const options = { 
      method: "PATCH",
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }

    const response = await fetch(encodeURL(),options);
    if(!response.ok){
      throw new Error(response.statusText);
    }
    const {records} = await response.json();
    return {
      id: records[0].id,
      ...records[0].fields,    
    }
  }
  
  /*
    Fetches todos from Airtable API
    1: Sets isLoading to true
    2: Fetches todos from Airtable API
    3: If response is not ok, throws an error
    4: If response is ok, sets todoList to the records returned from the API
    5: If an error occurs, sets errorMessage to the error message
    6: Finally, sets isLoading to false
    7: useEffect is called when the component mounts, unmounts, or updates
    8: added sortField, sortDirection, url, queryString, and token to dependency array
  */
  useEffect(() => {
    const fetchTodos = async () => {
      // setIsLoading(true);
      dispatch({ type: todoActions.fetchTodos })
      const options = {
        method: "GET",
        headers : {
          "Authorization" : token,
      }, 
    };

     try {
          const response = await fetch(encodeURL(), options);
          if(!response.ok){ //evaluates to false
            throw new Error(response.statusText);
          }
          const {records} = await response.json();
          dispatch({ 
            type: todoActions.loadTodos, 
            records: records
          })
        //   setTodoList(records.map((record) => {
        //     const todo = {
        //       id: record.id,
        //       ...record.fields,
        //       title: record.fields.title,
        //       isCompleted: record.fields.isCompleted,
        //     };
        //     if(!todo.isCompleted){
        //       // if isCompleted is not true, set it to false
        //       todo.isCompleted = false;
        //     }
        //     return todo;
        //   })
        // );
      }
      catch(error){
        console.log("Error caught in useEffect:", error.message); 
        dispatch({ 
          type: todoActions.setLoadError,
          error: error
        })
        // setErrorMessage(error.message);
      }  
      finally{
        // setIsLoading(false);
        dispatch({ 
          type: todoActions.setIsLoading,
          value: false
        })
      } 
  };
  fetchTodos();
},[sortField, sortDirection, baseUrl, queryString, token]);


  /* 
    Argument: newTask (originally newTodo)
    Gives newTodo three properties: title, id, and isCompleted
    calls todoList state variable containing a destructured (...) todoList and newTodo
    Fetch request for new todos
    try, catch for saving fetch requests and loading errors if unable to save
    finally, sets isSaving to false
  */
  const handleAddTodo = async (newTask) => {
    // const newTodo = { title: newTask, id: Date.now(), isCompleted: false };
    // dispatch({ type: todoActions.newTodo, newTodo: newTodo })
    // setTodoList([...todoState.todoList, newTodo]); //destructured
    const payload = {
      records: [
        {
          fields: {
            title: newTask,//newTask is the title string
            isCompleted: false,//always false when creating a new todo
          },
        },
      ],
    };
    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
    try{
      // setIsSaving(true);
      dispatch({ 
        type: todoActions.setIsSaving,
        value: true
      })
      const resp = await fetch(encodeURL(), options);
      if(!resp.ok){
        throw new Error(resp.message);
      }
      const {records} = await resp.json();
      dispatch({
        type: todoActions.addTodo,
        records: records
      })
      // const savedTodo = {
      //   id: records[0].id,
      //   ...records[0].fields,//destructures remaining key/value pairs
      // }
      // if(!savedTodo.isCompleted){
      //   savedTodo.isCompleted = false;
      // }
      // setTodoList([...todoList, savedTodo]);
    }
    catch(error){
      dispatch({
        type: todoActions.setErrorMessage,
        value: error.message
      })
    }
    finally{
      // setIsSaving(false);
      dispatch({
        type: todoActions.setIsSaving,
        value: false
      })
    }
  }

 const updateTodo = async (id, newTitle) =>{
    const editedTodos = todoState.todoList.map((todo) => {
        return todo.id === id ? {...todo, title: newTitle} : todo; 
    });
    dispatch({
        type: todoActions.editedTodos,
        editedTodos: editedTodos
      })
    // setTodoList(editedTodos);//optimistic update
    //saves original todo by finding it's associated object in the todoList array by each object's id
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
  
    try{  
      //fetch request 
    await syncTodos({
      id: originalTodo.id,
      title: newTitle,
      isCompleted: originalTodo.isCompleted,
    });
      // if(!syncedTodos.isCompleted){
      //   syncedTodos.isCompleted = false;
      // }
      
      // const updatedTodos = editedTodos.map((todo) => {
      //   return todo.id === syncedTodos.id ? {...syncedTodos} : todo;
      // });
      // setTodoList(updatedTodos);
    }
    catch(error){
     dispatch({
        type: todoActions.setErrorMessage,
        value: error.message
     })
      //reverts to original todo
      // const revertedTodos = todoList.map((todo) => {
      //   todo.id === originalTodo.id ? {...originalTodo} : todo;
      // });
      // setTodoList(revertedTodos);
      dispatch({
         type: todoActions.revertTodos,
         originalTodo: originalTodo
      })
    }
    finally{
      // setIsSaving(false);
      dispatch({
        type: todoActions.setIsSaving,
        value: false
      })
    }
  }
  /*
    Argument: id
    Maps through todoList:
    1: if current todo.id == id -> return a new object that destructures current todo (...todo) & isCompleted is set to true
    2: Else if current todo.id != id -> return todo
  */
  const completeTodo = async(id) => {
    const updatedTodos = todoState.todoList.map((todo) => {
      return todo.id === id ? { ...todo, isCompleted: true } : todo;
    });
      dispatch({
         type: todoActions.updatedTodos,
         updatedTodos: updatedTodos
      })
    // setTodoList(updatedTodos);
    //saves original todo by finding it's associated object in the todoList array by each object's id
    const completedTodo = todoState.todoList.find((todo) => todo.id === id);
    //fetch request using editedTodos
    
    try{
      await syncTodos({
         id: completedTodo.id,
         title: completedTodo.title,
         isCompleted: true,
      })
      // if(!syncedTodos.isCompleted){
      //   syncedTodos.isCompleted = false;
      // }
      // const refreshTodos = updatedTodos.map((todo) => {
      //   return todo.id === syncedTodos.id ? {...syncedTodos} : todo;
      // });
      // setTodoList(refreshTodos);
    
    }
    catch(error){
      dispatch({
          type: todoActions.setErrorMessage,
          value: error.message
      })
      dispatch({
         type: todoActions.revertTodos,
         completedTodo: completedTodo
      })
      //reverts to original todo
      // const revertedTodos = todoList.map((todo) => {
      //   todo.id === completedTodo.id ? {...completedTodo} : todo;
      // });
      // setTodoList(revertedTodos);
    }
    finally{
      // setIsSaving(false);
      dispatch({
         type: todoActions.setIsSaving,
         value: false
      })
    }

  }

  return (
    <>
    <div className={StyledApp.catWrapper}>
     

      <div className={StyledApp.todoBody}>
            <h1>Todo List</h1>
            {/* onAddTodo is a prop */}
            <AddTodoForm onAddTodo={handleAddTodo} isSaving={todoState.isSaving}/>
            
            <TodoList todoList={todoState.todoList} onCompleteTodo={completeTodo} 
            onUpdateTodo={updateTodo} isLoading={todoState.isLoading}/>

            <hr/>
            <ViewForm sortDirection={sortDirection} setSortDirection={setSortDirection} 
            sortField={sortField} setSortField={setSortField}
            queryString={queryString} setQueryString={setQueryString}/>
            <hr/>
            {/* Evaluates errorMessage */}
            {todoState.errorMessage && (
              <div className={StyledApp.error}>
                <hr />
                <p>{todoState.errorMessage}</p>
                <button onClick={() => dispatch({type: todoActions.clearError})}>Dismiss</button>
              </div>
            )}
          </div>
    </div>
    </> 
  );
}

export default App;