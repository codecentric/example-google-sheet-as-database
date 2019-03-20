import { createServer } from 'http';
import { collection, setup, refresh } from './store/recipes';

const port = +process.env.PORT || 8000;

setup().then(() => {
  createServer(async (req, res) => {
    try {
      const data = collection.find();
      res.statusCode = 200;
      res.end(JSON.stringify(data), 'utf8');
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify(err));
    }
  }).listen(port, () => {
    console.log(`🚀  Server listening on port ${port}!`);

    setInterval(refresh, 30000);
  });
});
