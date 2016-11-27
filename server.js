const app = require('express')(),
  bodyParser = require('body-parser'),
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
  let found;
  todos.forEach(todo => {
    if (todo.id === id) {
      found = todo;
      return true;
    }
  })
  if (found) {
    return res.status(200).json(found);
  } else {
    return res.status(404).json({
      success: false,
      message: 'todo with that id not found'
    });
  }
})

app.post('/todos', (req, res) => {
  if (req.body.description){
     let todo = {
      id: todoNextId,
      description: req.body.description,
      completed: req.body.completed  || false
    };
    todos.push(todo);
    todoNextId++;
    res.status(201).json({success:true, message: "todo added"});
  }else{
    res.status('400').json({success:false, message:"please add a description"});
  }
   
})

app.listen(port, () => {
  console.log('express is listening on port ' + port);
});