import "./App.css";
import StyledApp from "./App.module.css";
import { useState, useEffect, useCallback, useReducer } from "react";
import { useLocation, Routes, Route, useSearchParams, useNavigate } from 'react-router';
import TodosPage from "./pages/TodosPage";
import Header from "./shared/HeaderNav";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import {
  todoReducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const location = useLocation();
  const navigate = useNavigate();
  const filteredTodoList = todoState.todoList.filter(todo => !todo.isCompleted);
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  /*
    the numerical value of the 'page' param in the URL
    have to parseInt the value since params are always returned as strings
  */
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1 ) * itemsPerPage;
  const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;
  const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil((filteredTodoList.length)/itemsPerPage);
  const [title, setTitle] = useState("");
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
    let sortQuery = `sort[0][field]=${todoState.sortField}&sort[0][direction]=${todoState.sortDirection}`;
    if (todoState.queryString){
      searchQuery = `&filterByFormula=SEARCH("${todoState.queryString}",+title)`;
    }
    return `${baseUrl}?${sortQuery}${searchQuery}`;
  }, [baseUrl,todoState.queryString,todoState.sortDirection,todoState.sortField]);

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
      throw new Error(response.message);
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
            throw new Error(response.message);
          }
          const {records} = await response.json();
          dispatch({ 
            type: todoActions.loadTodos, 
            records: records
          })
      }
      catch(error){
        dispatch({ 
          type: todoActions.setErrorMessage,
          error: error
        })
      }  
      finally{
        dispatch({ 
          type: todoActions.setIsLoading,
          value: false
        })
      } 
  };
    fetchTodos();
  },[encodeURL,todoState.sortField, todoState.sortDirection, baseUrl, todoState.queryString, token]);

  useEffect(() => {
     if (location.pathname === "/") {
        setTitle("Todo List");
     }
     else if (location.pathname === "/about") {
        setTitle("About");
     }
     else {
        setTitle("Not Found");
     }
  },[location]);
  /* 
    Argument: newTask (originally newTodo)
    Gives newTodo three properties: title, id, and isCompleted
    calls todoList state variable containing a destructured (...) todoList and newTodo
    Fetch request for new todos
    try, catch for saving fetch requests and loading errors if unable to save
    finally, sets isSaving to false
  */
  const handleAddTodo = async (newTask) => {
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
    }
    catch(error){
      dispatch({
        type: todoActions.setErrorMessage,
        error: error
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
    //saves original todo by finding it's associated object in the todoList array by each object's id
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
  
    try{  
      //fetch request 
      await syncTodos({
        id: originalTodo.id,
        title: newTitle,
        isCompleted: originalTodo.isCompleted,
      });
    }
    catch(error){
      dispatch({
        type: todoActions.setErrorMessage,
        error: error
      })
      dispatch({
        type: todoActions.revertTodos,
        originalTodo: originalTodo
      })
    }
    finally{
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
  
      dispatch({
         type: todoActions.completeTodos,
         id
      })

    
    try{
      const todo = todoState.todoList.find((todo) => todo.id === id);
      const updatedStatus = !todo.isCompleted;
      await fetch( `${baseUrl}/${id}`, {
        method: "PATCH",
        headers : {
          Authorization: token,
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({fields: { isCompleted: updatedStatus}})
      })
    }
    catch(error){
      dispatch({
         type: todoActions.revertTodos,
         editedTodo: todoState.todoList,
         error
      })
    }
    finally{
      dispatch({
         type: todoActions.setIsSaving,
         value: false
      })
    }
  }

  const handleSetSortDirection = useCallback((value) => {
    dispatch({type: todoActions.setSortDirection, value});
  }, []);

  const handleSetSortField = useCallback((value) => {
    dispatch({type: todoActions.setSortField, value});
  }, []);

  const handleSetQueryString = useCallback((value) => {
    dispatch({type: todoActions.setQueryString, value});
  }, []);

  const handlePreviousPage = (page) => {
    if (page > 1) {
      setSearchParams({page: currentPage - 1});
    }
  }

  const handleNextPage = (page) => {
    if (page < totalPages) {
      setSearchParams({page: currentPage + 1});
    }
  }

  useEffect(() => {
    if (totalPages > 0) {
       if (currentPage < 1 || currentPage > totalPages) {
        navigate("/");
      }
    }
   
  },[currentPage,totalPages,navigate]);

  return (
    <> 
    <Header title={title}/>
    <Routes>
      <Route path="/" element={
          <TodosPage 
            dispatch={dispatch}
            todoState={todoState}
            todoActions={todoActions}
            currentTodos={currentTodos}
            onAddTodo={handleAddTodo}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
            setSortDirection={handleSetSortDirection}
            setSortField={handleSetSortField}
            setQueryString={handleSetQueryString}
          />
      } />
      <Route path="/about" element={<About/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>

      {/* Hides pagination on About page */}
    {location.pathname !== "/about" && (
    <div className={StyledApp.paginationControls}>
      <button onClick={() => handlePreviousPage(currentPage)} 
      className={StyledApp.prevBtn}
      disabled={currentPage === 1}
      >Previous</button>
      <span className={StyledApp.pageSpan}>Page {currentPage} of {totalPages}</span>
      <button onClick={() => handleNextPage(currentPage)} 
      className={StyledApp.nextBtn}
      disabled={currentPage === totalPages}
      >Next</button>
    </div>
   ) }
    </> 
  );
}

export default App;