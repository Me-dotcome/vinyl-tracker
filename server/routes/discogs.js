const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

// GET /api/discogs/search?q=searchterm
router.get('/search', authMiddleware, async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const response = await axios.get('https://api.discogs.com/database/search', {
      params: { q, type: 'release', per_page: 10 },
      headers: {
        Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
        'User-Agent': 'VinylTrackerApp/1.0',
      },
    });

    // Return only the fields the client needs
    const results = response.data.results.map(item => ({
      discogsId: String(item.id),
      title: item.title,
      year: item.year || '',
      label: item.label ? item.label[0] : '',
      genre: item.genre ? item.genre[0] : '',
      coverUrl: item.cover_image || '',
    }));

    res.json(results);
  } catch (err) {
    console.error('Discogs API error:', err.message);
    res.status(500).json({ message: 'Discogs search failed. Check your API token.' });
  }
});

module.exports = router;
