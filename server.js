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



app.post('/users', (req, res) => {
  const body = _.pick(req.body, 'name', 'email', 'password')
  db.user.create(body).then((user) => {
    console.log(user.toString())
    res.status(201).json({
      success: true,
      message: "user successfully created",
      data:user  
    });
  }).catch((err) => {
    res.status(400).json({
        success: false,
        error: err
    });
  });
});



/*
 * gets all TOOO
 */
app.get('/todos', (req, res) => {
  const query = req.query;
  const where = {};
  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
    where.completed = false;
  }
  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: `%${query.q}%`
    }
  }
  db.todo.findAll({
    where: where
  }).then((todo) => {
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
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'Todo Not found'
        })
      }
      return res.status(200).json({
        success: true,
        todo: todo
      });
    }).catch((err) => {
      return res.status(500).json(err);
    });
})

/*
 * creates a TOOO
 */
app.post('/todos', (req, res) => {
  const body = _.pick(req.body, 'description', 'completed');
  if (body.description && body.description.trim().length > 1) {
    db.todo.create(body).then(() => {
      res.status(201).json({
        success: true,
        message: "todo added"
      });
    }).catch((err) => {
      res.status(500).json(err);
    })
  } else {
    res.status('400').json({
      success: false,
      error: "please add a description"
    });
  }
})

/*
 * deletes a TOOO
 */
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.todo.findById(id).then((todo) => {
    if (todo) {
      todo.destroy().then(() => {
        res.status(200).json({
          success: true,
          message: "todo deleted"
        });
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Todo Not found'
      });
    }
  }).catch((err) => {
    res.status(500).json({
      success: false,
      error: err
    });
  })
})

/*
 * Update a TOOO
 */
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const body = _.pick(req.body, 'completed', 'description');
  let validAttributes = {};

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  }
  if (body.hasOwnProperty('description') &&
    _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  }
  db.todo.findById(id).then((todo) => {
    if (todo) {
      todo.update(validAttributes).then((todo) => {
        res.status(200).json(todo);
      }).catch((err) => {
        res.status(400).json(err);
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Todo Not found'
      });
    };
  }).catch((err) => {
    res.status(404).json({
      success: false,
      error: err
    });
  });
});

db.sequelize.sync({ force : true }).then(() => {
  app.listen(port, () => {
    console.log('express is listening on port ' + port);
  });
});
