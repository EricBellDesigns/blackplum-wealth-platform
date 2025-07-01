// @ts-ignore
const tableName = "offering_pictures";

exports.up = async function (knex) {
  const exists = await knex.schema.hasTable(tableName);

  if (!exists) {
    return knex.schema.createTable(tableName, table => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("offering_id", 50).notNullable()
        .references("offerings.id")
        .onDelete("CASCADE");
      table.string("path", 255).notNullable();
      table.integer("size");
      table.timestamps(false, true);
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
