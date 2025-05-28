import express from 'express';
import { Gauge, Registry } from 'prom-client';

const app = express();
const register = new Registry();

const customGauge = new Gauge({
  name: 'test',
  help: 'This is a test gauge',
  labelNames: ['name'],
});

register.registerMetric(customGauge);

setInterval(() => {
  customGauge.set({ name: 'name1' }, Math.floor(Math.random() * 100));
  customGauge.set({ name: 'name2' }, Math.floor(Math.random() * 100));
}, 1000);

app.get('/metrics', async (_, res: express.Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Metrics server running at http://localhost:${PORT}/metrics`);
});
