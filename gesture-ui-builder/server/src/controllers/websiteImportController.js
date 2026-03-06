import { parseWebsite } from '../services/htmlParserService.js';

export const importWebsite = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }

  try {
    const components = await parseWebsite(url);
    res.json({ components });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import website' });
  }
};
