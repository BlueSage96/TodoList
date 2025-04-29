import "./App.css";
import TodoList from "./features/Todolist/TodoList.jsx";
import AddTodoForm from "./features/TodoForm.jsx";
import { useState, useEffect } from "react";

function App() {
  const [todoList, setTodoList] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  
  /*
    Fetches todos from Airtable API
    1: Sets isLoading to true
    2: Fetches todos from Airtable API
    3: If response is not ok, throws an error
    4: If response is ok, sets todoList to the records returned from the API
    5: If an error occurs, sets errorMessage to the error message
    6: Finally, sets isLoading to false
    7: useEffect is called when the component mounts, unmounts, or updates
  */
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: "GET",
        headers : {
          "Authorization" : token,
      }, 
    };
     try {
          const response = await fetch(url, options);
          if(!response.ok){ //evaluates to false
            throw new Error(response.message);
          }
          const {records} = await response.json();
          setTodoList(records.map((record) => {
            const todo = {
              id: record.id,
              ...record.fields,
              title: record.fields.title,
              isCompleted: record.fields.isCompleted,
            };
            if(!todo.isCompleted){
              // if isCompleted is not true, set it to false
              todo.isCompleted = false;
            }
            return todo;
          })
        );
      }
      catch(error){
        setErrorMessage(error.message);
      }  
      finally{
        setIsLoading(false);
      } 
  };
  fetchTodos();
},[]);

  /* 
    Argument: newTask (originally newTodo)
    Gives newTodo three properties: title, id, and isCompleted
    calls todoList state variable containing a destructured (...) todoList and newTodo
    Fetch request for new todos
    try, catch for saving fetch requests and loading errors if unable to save
    finally, sets isSaving to false
  */
  const handleAddTodo = async (newTask) => {
    const newTodo = { title: newTask, id: Date.now(), isCompleted: false };
    setTodoList([...todoList, newTodo]); //destructured
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
      setIsSaving(true);
      const resp = await fetch(url, options);
      if(!resp.ok){
        throw new Error(resp.message);
      }
      const {records} = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,//destructures remaining key/value pairs
      }
      if(!savedTodo.isCompleted){
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
    }
    catch(error){
      console.log("Error while saving todo:", error);
      setErrorMessage(error.message);
    }
    finally{
      setIsSaving(false);
    }
  }

 const updateTodo = async (id, newTitle) =>{
    const editedTodos = todoList.map((todo) => {
        return todo.id === id ? {...todo, title: newTitle} : todo; 
    });
    setTodoList(editedTodos)
    //saves original todo by finding it's associated object in the todoList array by each object's id
    const originalTodo = todoList.find((todo) => todo.id === id);
    //fetch request using editedTodos
    const payload = {
      records: [
        {
          id: originalTodo.id,
          fields: {
            title: newTitle,
            isCompleted: originalTodo.isCompleted,
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
      body: JSON.stringify(payload),
    }
    try{
      const response = await fetch(url, options);
      if(!response.ok){
        throw new Error (response.message);
      }
      const {records} = await response.json();

      if(!records || records.length === 0){
        throw new Error("No records returned from server");
      }

      //object from Airtable  
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,//created table fields created are passed in as key/value pairs onto the updatdTodo object
      }
      if(!updatedTodo.isCompleted){
        updatedTodo.isCompleted = false;
      }
      const updatedTodos = todoList.map((todo) => {
        return todo.id === updatedTodo.id ? {...updatedTodo} : todo;
      });
      setTodoList(updatedTodos);
    }
    catch(error){
      console.log("Error while updating todo:", error);
      setErrorMessage(`${error.message} Reverting todo...`);
      //reverts to original todo
      const revertedTodos = todoList.map((todo) => {
        todo.id === originalTodo.id ? {...originalTodo} : todo;
      });
      setTodoList(revertedTodos);
    }
    finally{
      setIsSaving(false);
    }
  }
  /*
    Argument: id
    Maps through todoList:
    1: if current todo.id == id -> return a new object that destructures current todo (...todo) & isCompleted is set to true
    2: Else if current todo.id != id -> return todo
  */
  const completeTodo = async(id) => {
    const updatedTodos = todoList.map((todo) => {
      return todo.id === id ? { ...todo, isCompleted: true } : todo;
    });
    setTodoList(updatedTodos);
    //saves original todo by finding it's associated object in the todoList array by each object's id
    const completedTodo = todoList.find((todo) => todo.id === id);
    //fetch request using editedTodos
    const payload = {
      records: [
        {
          id: completedTodo.id,
          fields: {
            title: completedTodo.title,
            isCompleted: true,//mark it completed
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
      body: JSON.stringify(payload),
    }
    try{
      const resp = await fetch(url, options);
      if(!resp.ok){
        throw new Error (resp.message);
      }
      const {records} = await resp.json();

      //object from Airtable  
      const updateCompleteTodo = {
        id: records[0].id,
        ...records[0].fields,//created table fields created are passed in as key/value pairs onto the updatdTodo object
      }
      if(!updateCompleteTodo.isCompleted){
        updateCompleteTodo.isCompleted = false;
      }
      const refreshTodos = todoList.map((todo) => {
        return todo.id === updateCompleteTodo.id ? {...updateCompleteTodo} : todo;
      });
      setTodoList(refreshTodos);
    }
    catch(error){
      console.log("Error while updating todo:", error);
      setErrorMessage(`${error.message} Reverting todo...`);
      //reverts to original todo
      const revertedTodos = todoList.map((todo) => {
        todo.id === completedTodo.id ? {...completedTodo} : todo;
      });
      setTodoList(revertedTodos);
    }
    finally{
      setIsSaving(false);
    }

  }

  return (
    <div>
      <h1>Todo List</h1>
      {/* onAddTodo is a prop */}
      <AddTodoForm onAddTodo={handleAddTodo} isSaving={isSaving}/>
      
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} 
      onUpdateTodo={updateTodo} isLoading={isLoading}/>

      {/* Evaluates errorMessage */}
      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;