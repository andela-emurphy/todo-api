const app = require('express')(),
      port = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.send('</h1>Hello world</h1>');
})


app.listen(port, () => {
  console.log('express is listening on port ' + port);
});