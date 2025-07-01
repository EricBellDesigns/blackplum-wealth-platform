// @ts-ignore
const tableName = "admins";

exports.up = async function (knex) {
  const exists = await knex.schema.hasTable(tableName);

  if (!exists) {
    return knex.schema.createTable(tableName, table => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("name", 255).notNullable();
      table.string("email", 255).unique().notNullable();
      table.string("password", 60).notNullable();
      table.timestamps(false, true);
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
