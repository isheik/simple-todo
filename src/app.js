import React from "react";
import { render } from "react-dom";

var createReactClass = require('create-react-class');

var todos = [{
    id: '_1',
    name: 'Buy some milk',
    done: true
}, {
    id: '_2',
    name: 'Birthday present to Alice',
    done: false
}];

var Todo = createReactClass({
    render: function() {
        var todo = this.props.todo;
        return (<li>{todo.name}<button>Done</button></li>);
    }
});

var TodoList = createReactClass({
    render: function(){
        var rows = this.props.todos.filter(function(todo){
            return !todo.done;
        }).map(function(todo){
            return(<Todo key={todo.id} todo={todo}></Todo>);
        });
        return (
            <div className="active-todos">
                <h2>Active</h2>
                <ul>{rows}</ul>
            </div>
        );
    }
});

var TodoForm = createReactClass({
    handleSubmit: function(e){
        e.preventDefault();
        var name = this.refs.todoName.getDOMNode().value.trim();
        if(name){
            aleat(name);
            this.refs.todoName.getDOMNode().value = '';
        }
    },
    render: function(){
        return (
            <form onSubmit={this.handleSubmit}>
                <input ref="todoName"></input><input type="submit"></input>

            </form>
        );
    }
});


const App = () => (
    <div>
        <h1>My Todo</h1>
        <TodoList todos={todos}/>
    </div>
);

export default App;