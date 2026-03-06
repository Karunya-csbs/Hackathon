import fetch from 'node-fetch';
import { load } from 'cheerio';

export const parseWebsite = async (url) => {
  try {
    // Validate URL
    new URL(url);

    // Fetch HTML with user agent to avoid blocking
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const components = extractComponents(html);
    return components;
  } catch (error) {
    console.error('HTML parsing error:', error);
    throw new Error('Failed to parse website');
  }
};

const extractComponents = (html) => {
  const $ = load(html);
  const components = [];

  // Extract navbar
  const navbars = $('nav, [role="navigation"]');
  if (navbars.length > 0) {
    components.push({
      type: 'Navbar',
      description: 'Navigation bar detected',
      html: navbars.first().html()
    });
  }

  // Extract buttons
  const buttons = $('button');
  if (buttons.length > 0) {
    components.push({
      type: 'Button',
      description: `${buttons.length} buttons detected`,
      count: buttons.length
    });
  }

  // Extract forms
  const forms = $('form');
  if (forms.length > 0) {
    components.push({
      type: 'Form',
      description: `${forms.length} forms detected`,
      count: forms.length
    });
  }

  // Extract cards (divs with border or shadow)
  const cards = $('div[class*="card"], div[class*="shadow"], article');
  if (cards.length > 0) {
    components.push({
      type: 'Card',
      description: `${cards.length} card-like components detected`,
      count: cards.length
    });
  }

  // Extract input fields
  const inputs = $('input[type="text"], input[type="email"], input[type="password"]');
  if (inputs.length > 0) {
    components.push({
      type: 'Input',
      description: `${inputs.length} input fields detected`,
      count: inputs.length
    });
  }

  // Extract images
  const images = $('img');
  if (images.length > 0) {
    components.push({
      type: 'Image',
      description: `${images.length} images detected`,
      count: images.length
    });
  }

  // Extract grids/layouts
  const grids = $('[class*="grid"], [class*="flex"]');
  if (grids.length > 0) {
    components.push({
      type: 'Grid',
      description: 'Grid/Flex layouts detected',
      count: grids.length
    });
  }

  return components;
};
