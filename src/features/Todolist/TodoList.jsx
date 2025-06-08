import TodoListItem from "./TodoListItem";
import StyledTodos from "./TodoList.module.css";

function TodoList({ currentTodos, onCompleteTodo, onUpdateTodo, isLoading }) {
  // contains todoList that has been filtered to remove any whose .isCompleted property is not true
  // const filteredTodoList = todoList.filter((todo) => todo?.isCompleted === false);
  return (
    <>
      <ul className={StyledTodos.todoList}>
        {isLoading ? 
        //Loading message displayed to user
        (<p>Todo list loading...</p>):
        currentTodos.length === 0 ? ( 
          /* 
        If true -> render a paragrah tag ("Add todo above...")
        If false -> render unordered
        *filteredTodoList replaces todoList

        Added a second argument "index" to address error: 
        "Each child in a list should have a unique "key" prop"." */
          <p>Add todo above to get started</p>
        ) : (
          currentTodos.map((todo, index) => (
            <TodoListItem
              todo={todo}
              key={index}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))
        )}
      </ul>
    </>
  );
}

export default TodoList;