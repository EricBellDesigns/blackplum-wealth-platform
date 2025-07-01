// @ts-ignore
const tableName = "investors";

exports.up = async function (knex) {
  const exists = await knex.schema.hasTable(tableName);

  if (!exists) {
    return knex.schema.createTable(tableName, table => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("name", 255).notNullable();
      table.string("email", 255).unique().notNullable();
      table.string("password", 60).notNullable();
      table.string("residency_status", 30).notNullable()
        .checkIn(["individual_california_resident", "entity_california_resident", "non_california_resident"]);
      table.string("investing_experience", 32).notNullable()
        .checkIn(["experienced_trust_deed_investor", "new_trust_deed_investor"]);
      table.integer("investing_experience_years");
      table.string("confirmation_code", 16);
      table.boolean("confirmed").defaultTo(false);
      table.timestamps(false, true);
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
