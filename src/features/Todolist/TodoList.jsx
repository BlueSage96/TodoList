import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
  return (
    <>
      <ul>
        {/* Added a second argument "index" to address error: 
      "Each child in a list should have a unique "key" prop"." */}
        {filteredTodoList.length === 0 ? (
          <p>Add todo above to get started</p>
        ) : (
          filteredTodoList.map((todo, index) => (
            <TodoListItem
              todo={todo}
              key={index}
              onCompleteTodo={onCompleteTodo}
            />
          ))
        )}
      </ul>
    </>
  );
}
export default TodoList;
