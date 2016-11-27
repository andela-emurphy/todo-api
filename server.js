const app = require('express')(),
  bodyParser = require('body-parser'),
  _ = require('underscore'),
  port = process.env.PORT || 2000;

let todos = [],
  todoNextId = 1;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}))

app.get('/', (req, res) => {
  res.send('</h1>Hello world</h1>');
})

app.get('/todos', (req, res) => {
  res.status(200).json(todos);
})

app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let foundTodo = _.findWhere(todos, {id: id});
  if (foundTodo) {
    return res.status(200).json(foundTodo);
  } else {
    return res.status(404).json({
      success: false,
      message: 'todo with that id not found'
    });
  }
})

app.post('/todos', (req, res) => {
  let body = _.pick(req.body, 'description', 'completed');
  if (body.description && body.description.trim().length !== 0) {
    let todo  = {
      id : todoNextId,
      description: body.description,
      completed: body.completed ? true : false
    };
    todos.push(todo);
    todoNextId++;
    res.status(201).json({success:true, message: "todo added"});
  }else{
    res.status('400').json({success:false, message:"please add a description"});
  }
})

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let todo = _.findWhere(todos, {id: id});
  console.log(todo)
  if(todo) {
    todos = _.without(todos, todo);
    res.status(200).json({success:true, message: "todo deleted"});
  }else {
    res.status(404).json({success:false, message: "todo with that is not found"});
  }
})



app.listen(port, () => {
  console.log('express is listening on port ' + port);
});