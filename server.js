const app = require('express')(),
      port = process.env.PORT || 2000;

let todos = [{
  id: 1,
  description: "meet mom for launch",
  completed: false,
}, {
  id: 2,
  description: "go to market",
  completed: false
}]

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
    if(todo.id === id) {
      found  = todo;
      return true;
    }
  })
  if(found) {
    return res.status(200).json(found);
  } else {
    return res.status(404).json({success :false, message: 'todo with that id not found'});
  }
})


app.listen(port, () => {
  console.log('express is listening on port ' + port);
});