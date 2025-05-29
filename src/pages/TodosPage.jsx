import StyledPages from '../App.module.css';
import TodoList from "../features/Todolist/TodoList";
import AddTodoForm from "../features/TodoForm";
import ViewForm from "../features/TodosViewForm";

function TodosPage({handleAddTodo,todoState, todoActions,dispatch, onCompleteTodo,
    onUpdateTodo, setSortDirection, setSortField, setQueryString,
}) {
    return (
        <>
            <div className={StyledPages.catWrapper}>
                <div className={StyledPages.todoBody}>
                    <h1>Todo List</h1>
                    {/* onAddTodo is a prop */}
                    <AddTodoForm onAddTodo={handleAddTodo} isSaving={todoState.isSaving} />

                    <TodoList todoList={todoState.todoList} onCompleteTodo={onCompleteTodo} 
                     onUpdateTodo={onUpdateTodo} isLoading={todoState.isLoading}
                    />
                    <hr/>
                    <ViewForm 
                    sortDirection={todoState.sortDirection}
                    setSortDirection={setSortDirection}
                    sortField={todoState.sortField}
                    setSortField={setSortField}
                    queryString={todoState.queryString}
                    setQueryString={setQueryString}
                    />
                    <hr/>
                    {/* Evaluates Error Message */}
                    {todoState.errorMessage && (
                        <div className={StyledPages.error}>
                            <hr/>
                            <p>{todoState.errorMesage}</p>
                            <button onClick={() => dispatch({type: todoActions.clearError})}Dismiss></button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default TodosPage;