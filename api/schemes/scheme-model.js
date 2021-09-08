const db = require("../../data/db-config");

async function find() {
  const result = await db("schemes as sc")
    .leftJoin("steps as st", "st.scheme_id", "sc.scheme_id")
    .select("sc.*")
    .count("st.step_id as number_of_steps")
    .groupBy("sc.scheme_id");

  return result;
}

async function findById(scheme_id) {
  const rows = await db("schemes as sc")
    .leftJoin("steps as st", "st.scheme_id", "sc.scheme_id")
    .select("st.*", "sc.scheme_name", "sc.scheme_id")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number");

  let steps;
  if (!rows[0].step_id) {
    steps = [];
  } else {
    steps = rows.map((row) => ({
      step_id: row.step_id,
      step_number: row.step_number,
      instructions: row.instructions,
    }));
  }
  const result = {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: steps,
  };
  return result;
}

async function findSteps(scheme_id) {
  const rows = await db("schemes as sc")
    .leftJoin("steps as st", "st.scheme_id", "sc.scheme_id")
    .select("st.*", "sc.scheme_name", "sc.scheme_id")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number");

  let steps;
  if (!rows[0].step_id) {
    steps = [];
  } else {
    steps = rows.map((row) => ({
      step_id: row.step_id,
      step_number: row.step_number,
      instructions: row.instructions,
      scheme_name: row.scheme_name,
    }));
  }

  return steps;
}

async function add(scheme) {
  const [id] = await db("schemes").insert(scheme);
  return findById(id);
}

async function addStep(scheme_id, step) {
  const newStepId = await db("steps").insert({ ...step, scheme_id });
  const rows = await db("schemes as sc")
    .leftJoin("steps as st", "st.scheme_id", "sc.scheme_id")
    .select("st.*", "sc.scheme_name")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number");
  return rows;
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
