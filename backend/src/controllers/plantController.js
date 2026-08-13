const db = require("../database/database");

const fields = `
id, name, species, location, sunlight,
watering_frequency AS wateringFrequency,
notes, created_at AS createdAt, updated_at AS updatedAt
`;

function findPlant(id) {
  return db.prepare(`SELECT ${fields} FROM plants WHERE id = ?`).get(id);
}

exports.getPlants = (req, res) => {
  const plants = db.prepare(`
    SELECT ${fields},
      (SELECT watered_at FROM watering_records
       WHERE plant_id = plants.id
       ORDER BY datetime(watered_at) DESC LIMIT 1) AS lastWatered
    FROM plants
    ORDER BY datetime(created_at) DESC
  `).all();

  res.json(plants);
};

exports.getPlant = (req, res) => {
  const plant = findPlant(req.params.id);
  if (!plant) return res.status(404).json({ message: "Plant not found" });

  const care = db.prepare(`
    SELECT instructions, updated_at AS updatedAt
    FROM care_instructions WHERE plant_id = ?
  `).get(req.params.id);

  const wateringRecords = db.prepare(`
    SELECT id, watered_at AS wateredAt, notes
    FROM watering_records WHERE plant_id = ?
    ORDER BY datetime(watered_at) DESC
  `).all(req.params.id);

  res.json({
    ...plant,
    careInstructions: care?.instructions || "",
    wateringRecords
  });
};

exports.createPlant = (req, res) => {
  const {
    name, species = "", location = "",
    sunlight = "Indirect", wateringFrequency = 7, notes = ""
  } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: "Plant name is required" });
  }

  const result = db.prepare(`
    INSERT INTO plants
    (name, species, location, sunlight, watering_frequency, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    name.trim(), species.trim(), location.trim(), sunlight,
    Number(wateringFrequency) || 7, notes.trim()
  );

  res.status(201).json(findPlant(result.lastInsertRowid));
};

exports.updatePlant = (req, res) => {
  if (!findPlant(req.params.id)) {
    return res.status(404).json({ message: "Plant not found" });
  }

  const {
    name, species = "", location = "",
    sunlight = "Indirect", wateringFrequency = 7, notes = ""
  } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: "Plant name is required" });
  }

  db.prepare(`
    UPDATE plants SET
      name=?, species=?, location=?, sunlight=?,
      watering_frequency=?, notes=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    name.trim(), species.trim(), location.trim(), sunlight,
    Number(wateringFrequency) || 7, notes.trim(), req.params.id
  );

  res.json(findPlant(req.params.id));
};

exports.deletePlant = (req, res) => {
  const result = db.prepare("DELETE FROM plants WHERE id=?").run(req.params.id);

  if (!result.changes) {
    return res.status(404).json({ message: "Plant not found" });
  }

  res.json({ message: "Plant deleted successfully" });
};

exports.waterPlant = (req, res) => {
  if (!findPlant(req.params.id)) {
    return res.status(404).json({ message: "Plant not found" });
  }

  const result = db.prepare(`
    INSERT INTO watering_records (plant_id, notes)
    VALUES (?, ?)
  `).run(req.params.id, (req.body.notes || "").trim());

  const record = db.prepare(`
    SELECT id, watered_at AS wateredAt, notes
    FROM watering_records WHERE id=?
  `).get(result.lastInsertRowid);

  res.status(201).json(record);
};

exports.saveCareInstructions = (req, res) => {
  if (!findPlant(req.params.id)) {
    return res.status(404).json({ message: "Plant not found" });
  }

  const instructions = (req.body.instructions || "").trim();

  if (!instructions) {
    return res.status(400).json({ message: "Care instructions are required" });
  }

  db.prepare(`
    INSERT INTO care_instructions (plant_id, instructions)
    VALUES (?, ?)
    ON CONFLICT(plant_id) DO UPDATE SET
      instructions=excluded.instructions,
      updated_at=CURRENT_TIMESTAMP
  `).run(req.params.id, instructions);

  res.json({ message: "Care instructions saved", instructions });
};

exports.getHistory = (req, res) => {
  if (!findPlant(req.params.id)) {
    return res.status(404).json({ message: "Plant not found" });
  }

  const watering = db.prepare(`
    SELECT id, 'watering' AS type, watered_at AS date,
           notes, 'Watered plant' AS description
    FROM watering_records WHERE plant_id=?
  `).all(req.params.id);

  const care = db.prepare(`
    SELECT id, 'care' AS type, updated_at AS date,
           instructions AS notes, 'Care instructions updated' AS description
    FROM care_instructions WHERE plant_id=?
  `).all(req.params.id);

  res.json([...watering, ...care].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  ));
};
