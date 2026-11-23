import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { knex } from 'knex';
import dbConfig from './knexfile';
import { createEventDAL } from './dal/events.dal';
import { createTicketDAL } from './dal/tickets.dal';
import { createGetEventsController } from './controllers/get-events';
import { MongoClient } from 'mongodb';
import { createSettingsDAL, SettingsDocument } from './dal/settings.dal';
import { createGetSettingsController } from './controllers/get-settings';
import { createPostSettingsController } from './controllers/post-settings';
import { handleError } from './middleware/handle-error';

const Knex = knex(dbConfig.development);

const eventDAL = createEventDAL(Knex);
const TicketDAL = createTicketDAL(Knex);

const app = express();

const mongoUri = process.env.MONGO_URI

if (!mongoUri) {
  throw new Error("MONGO_URI is required.")
}

const mongoClient = new MongoClient(mongoUri);
const settingsCollection = mongoClient.db("seetickets").collection<SettingsDocument>('settings');

const settingsDAL = createSettingsDAL(settingsCollection);

const getEvents = createGetEventsController({
  eventsDAL: eventDAL,
  ticketsDAL: TicketDAL,
});

const getSettings =createGetSettingsController({settingsDAL})

const postSettings = createPostSettingsController({ settingsDAL })

app.use(cors());
app.use(express.json());

app.use('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/events', (req, res, next) => {
  getEvents(req, res).catch(next);
});

app.get('/settings', (req, res, next) => {
  getSettings(req, res).catch(next);
})

app.post('/settings', (req, res, next) => {
  postSettings(req, res).catch(next);
})

app.use('/', (_req, res) => {
  res.json({ message: 'Hello API' });
});

app.use(handleError);

app.listen(3000, () => {
  console.log('Server Started');
});
