// import express from 'express';
import Knex from 'knex';

export const configureApp = async () => {
  // const app = express();
  let deactivators: (() => void)[] = [];

  const knexConnection = await Knex({
    client: 'postgresql',
    useNullAsDefault: true,
    connection:
      process.env.DATA_BASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/postgres',
  });

  deactivators.push(() => knexConnection.destroy());

  // app.use(express.json());

  return {
    // app,
    knexConnection,
    deactivate: async () => {
      await Promise.all(deactivators.map((fn) => fn()));
    },
  };
};
