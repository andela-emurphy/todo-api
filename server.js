const app = require('express')(),
  bodyParser = require('body-parser'),
  _ = require('underscore'),
  port = process.env.PORT || 2000;

let todos = [],
  todoNextId = 1;
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended : true }))

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
  };
})

app.post('/todos', (req, res) => {
  let body = _.pick(req.body, 'description', 'completed');
  console.log(body);
  if (body.description && body.description.trim().length !== 0 && _.isBoolean(body.completed)) {
    let todo  = {
      id : todoNextId,
      description: body.description,
      completed: body.completed
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


app.put('/todos/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let body = _.pick(req.body, 'completed', 'description');
  let matchedTodo = _.findWhere(todos, {id: id })
  let validAttributes = {}

  if(!matchedTodo) {
    return res.status(404).json()
  }
  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  }else if(body.hasOwnProperty(completed)) {
    return res.status(400).json();
  }
  if(_.isString(body.description) && body.description.trim() > 0) {
    validAttributes.description = body.description;
  }else if(body.hasOwnProperty('description')) {
    return res.status(400).json()
  }
  _.extend(matchedTodo, validAttributes);
  res.status(200).json(validAttributes);
});

app.listen(port, () => {
  console.log('express is listening on port ' + port);
});