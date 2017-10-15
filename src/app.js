import React from 'react';
import { render } from 'react-dom';
import update from 'immutability-helper';
import EventEmitter from 'event-emitter';
import assign from 'object-assign';
import createReactClass from 'create-react-class';

var generateId = (function() {
  var id = 0;
  return function() {
    return '_' + id++;
  }
})();


var todos = [{
    id: '_1',
    name: 'Buy some milk',
    done: true
}, {
    id: '_2',
    name: 'Birthday present to Alice',
    done: false
}];

var TodoStorage = {
  on: function(_, _callback) {//TODO use EventEmitter
    this._onChangeCallback = _callback;
  },
  getAll: function(callback) {
    callback(todos);
  },
  complete: function(id) {
    for(var i = 0; i < todos.length; i++) {
      var todo = todos[i];
      if(todo.id === id) {
        var newTodo = update(todo, {done: {$set: true}});
        todos = update(todos, {$splice: [[i, 1, newTodo]]});
        this._onChangeCallback();
        break;
      }
    }
  },
  create: function(name, callback) {
    var newTodo = {
      id: generateId(),
      name: name
    };
    todos = update(todos, {$push: [newTodo]});
    this._onChangeCallback();
    callback();
  }
};

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
    getInitialState: function() {
        return {
            name: ''
        };
    },
    handleNameChange: function(e) {
        this.setState({
            name: e.target.value
        });
    },
    handleSubmit: function(e){
        e.preventDefault();
        // var name = this.refs.todoName.getDOMNode().value.trim();
        var name = this.state.name.trim();
        // if(name){
        TodoStorage.create(name,function(){
            this.setState({
                name: ''
            });
        }.bind(this));
            // this.refs.todoName.getDOMNode().value = '';

        // }
    },
    render: function(){
        var disabled = this.state.name.trim().length <= 0;
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.name} onChange={this.handleNameChange} />
                <input type="submit" disabled={disabled} />

            </form>
        );
    }
});



var App = createReactClass({
    getInitialState: function(){
        return {
            todos: []
        };
    },
    componentDidMount: function(){
        var setState = function(){
            TodoStorage.getAll(function(todos){
                this.setState({
                    todos:todos
                });
            }.bind(this));
        }.bind(this);
        TodoStorage.on('change', setState);
        setState();
    },
    render: function(){
        return (
            <div>
                <h1>My Todo</h1>
                <TodoList todos={todos}/>
                <TodoForm />
            </div>
        );
    }
});



export default App;