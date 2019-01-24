// Node.js does not support ES6 yet but Babel can help us.
import express from 'express';
import expressGraphQL from 'express-graphql';

const app = express();

app.use(
  '/graphql',
  expressGraphQL({
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log('Listening');
});
