require("dotenv").config();
const path = require("path");
const {DB_SERVER, DB_PORT, DB_NAME, DB_USER, DB_PWD} = process.env;

const migrationSeedFiles = {
  migrations: {
    directory: path.join(__dirname, "db", "migrations")
  },
  seeds: {
    directory: path.join(__dirname, "db", "seeds")
  }
};

const knexfile = {
  development: Object.assign({},
    migrationSeedFiles,
    {
      client: "postgres",
      connection: {
        adapter: "postgresql",
        host: DB_SERVER,
        user: DB_USER,
        password: DB_PWD,
        database: DB_NAME,
        port: parseInt(DB_PORT) || 5432
      }
    }),
  production: Object.assign({},
    migrationSeedFiles,
    {
      client: "postgres",
      connection: {
        adapter: "postgresql",
        host: DB_SERVER,
        user: DB_USER,
        password: DB_PWD,
        database: DB_NAME,
        port: parseInt(DB_PORT) || 5432
      },
      pool: {
        min: 2,
        max: 10
      }
    })
}

module.exports = knexfile;
