// @ts-ignore
const tableName = "offerings";

exports.up = async function (knex) {
  const exists = await knex.schema.hasTable(tableName);

  if (!exists) {
    return knex.schema.createTable(tableName, table => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("admin_id", 50).notNullable()
        .references("admins.id")
        .onDelete("CASCADE");

      // Deal Information
      table.string("title", 255).notNullable();
      table.string("offering_type", 255).notNullable();
      table.date("target_funding_date").notNullable();
      table.decimal("minimum_investment", 10, 2).notNullable();
      table.decimal("total_capital_investment", 10, 2).notNullable();
      table.decimal("monthly_pmt_to_investor", 10, 2).notNullable();
      table.decimal("investor_yield", 10, 2).notNullable();
      table.decimal("gross_protective_equity", 10, 2).notNullable();
      table.string("exit_strategy", 1020);

      // Property Details
      table.string("property_address", 255).notNullable();
      table.string("property_type", 10).notNullable();
      table.string("occupancy", 20).notNullable();
      table.decimal("market_value", 10, 2).notNullable();
      table.string("apn", 20);
      table.string("county", 255);
      table.integer("year_built", 255);
      table.decimal("square_footage", 10, 2);
      table.string("lot_size", 255);
      table.integer("bedrooms");
      table.integer("bathrooms");
      table.string("exterior", 1020);
      table.string("zoning", 1020);

      // Debt Stack
      table.boolean("existing_first_mortgage").defaultTo(false);
      table.integer("borrower_credit_score").notNullable();
      table.string("loan_type", 20).notNullable();
      table.string("lien_position", 3).notNullable();
      table.string("payment_type", 15).notNullable();
      table.string("loan_term", 255).notNullable();
      table.string("prepaid_interest", 255);
      table.string("guaranteed_interest", 255);

      table.timestamps(false, true);
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
