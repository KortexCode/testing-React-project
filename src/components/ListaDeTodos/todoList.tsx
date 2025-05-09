import React from "react"

export const TodoList: React.FC = () => {

    const [todoText, setTodoText] = React.useState<string>("");
    const [todoList, setTodoList] = React.useState<string[]>([]);

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;
      setTodoText(text);
    };
    const handleAddTodo = () => {
        setTodoList(prev => [...prev, todoText]);
    }
    return (
        <div>
            <h1>Add to do</h1>
            <input onChange={handleChangeInput} type="text" placeholder="Enter Todo Activity"/>
            <button onClick={handleAddTodo}>Add Todo</button>
            <ul>
                {todoList.map((todo) => {
                    return <li>{todo}</li>
                })}
            </ul>
        </div>
    )
}