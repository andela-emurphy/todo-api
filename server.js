const app = require('express')(),
  bodyParser = require('body-parser'),
  _ = require('underscore'),
  db = require('./db');
  port = process.env.PORT || 2000;

let todos = [],
  todoNextId = 1;
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended : true }))



app.get('/', (req, res) => {
  res.send('</h1>Hello world</h1>');
})


/*
* gets all TOOO
*/
app.get('/todos', (req, res) => {
  const query = req.query;
  const where = {};
  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  }else if(query.hasOwnProperty('completed') && query.completed === 'false') {
    where.completed = false;
  }
  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like : `%${query.q}%`
    }
  }
  db.todo.findAll({where: where}).then(function(todo) {
    res.status(200).json(todo);
  })
});

/*
* gets a single TODO
*/
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.todo.findById(id)
    .then((todo) => {
      if(!todo) {
        return res.status(404).json({success: false, message: 'Todo Not found'})
      }
      return res.status(200).json({ success: true, todo: todo});
    }).catch((err) => {
      return res.status(500).json(err);
    });
})

/*
* creates a TOOO
*/
app.post('/todos', (req, res) => {
  let body = _.pick(req.body, 'description', 'completed');
  if (body.description && body.description.trim().length > 1 ) {
    db.todo.create(body).then(function() {
      res.status(201).json({
        success: true,
        message: "todo added"
      });
    }).catch(function(err) {
      res.status(500).json(err.message);
    })
  } else {
    res.status('400').json({
      success: false,
      message: "please add a description"
    });
  }
})

/*
* deletes a TOOO
*/
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let todo = _.findWhere(todos, {
    id: id
  });
  if (todo) {
    todos = _.without(todos, todo);
    res.status(200).json({
      success: true,
      message: "todo deleted"
    });
  } else {
    res.status(404).json({
      success: false,
      message: "todo with that is not found"
    });
  }
})

/*
* Update a TOOO
*/
app.put('/todos/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let body = _.pick(req.body, 'completed', 'description');
  let matchedTodo = _.findWhere(todos, {
    id: id
  })
  let validAttributes = {}

  if (!matchedTodo) {
    return res.status(404).json()
  }
  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty(completed)) {
    return res.status(400).json();
  }
  if (_.isString(body.description) && body.description.trim() > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).json()
  }
  _.extend(matchedTodo, validAttributes);
  res.status(200).json(validAttributes);
});

db.sequelize.sync().then(function() {
  app.listen(port, () => {
    console.log('express is listening on port ' + port);
  });
});
