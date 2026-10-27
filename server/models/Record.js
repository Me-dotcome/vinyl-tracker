const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  artist: {
    type: String,
    required: [true, 'Artist is required'],
    trim: true,
  },
  year: {
    type: Number,
  },
  label: {
    type: String,
    trim: true,
  },
  genre: {
    type: String,
    trim: true,
  },
  condition: {
    type: String,
    enum: ['M', 'NM', 'VG+', 'VG', 'G+', 'G', 'F', 'P', ''],
    default: '',
  },
  notes: {
    type: String,
  },
  discogsId: {
    type: String,
  },
  coverUrl: {
    type: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Record', recordSchema);
