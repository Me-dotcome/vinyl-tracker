const Record = require('../models/Record');

// GET /api/records — get all records for the logged-in user
exports.getRecords = async (req, res) => {
  try {
    const { genre, artist, year } = req.query;
    const filter = { userId: req.userId };

    if (genre) filter.genre = { $regex: genre, $options: 'i' };
    if (artist) filter.artist = { $regex: artist, $options: 'i' };
    if (year) filter.year = Number(year);

    const records = await Record.find(filter).sort({ addedAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching records', error: err.message });
  }
};

// POST /api/records — add a new record
exports.addRecord = async (req, res) => {
  try {
    const record = new Record({
      ...req.body,
      userId: req.userId, // always set from the JWT, never from the request body
    });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: 'Error adding record', error: err.message });
  }
};

// PUT /api/records/:id — update a record
exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, userId: req.userId });
    if (!record) {
      return res.status(404).json({ message: 'Record not found or not authorised.' });
    }

    Object.assign(record, req.body);
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: 'Error updating record', error: err.message });
  }
};

// DELETE /api/records/:id — delete a record
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!record) {
      return res.status(404).json({ message: 'Record not found or not authorised.' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting record', error: err.message });
  }
};
