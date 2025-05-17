import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name using ES modules pattern
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Retrieves page views from Fathom Analytics API
 */
async function retrievePageViews() {
  try {
    // Get Fathom API token from environment variable
    const token = process.env.FATHOM_TOKEN;

    if (!token) {
      console.error('FATHOM_TOKEN environment variable is not set');
      process.exit(1);
    }

    // Prepare query parameters
    const queryParams = new URLSearchParams({
      'entity_id': 'XCVRIKRE',
      'entity': 'pageview',
      'aggregates': 'pageviews',
      'field_grouping': 'pathname',
      'filters': JSON.stringify([
        {
          'property': 'pathname',
          'operator': 'is like',
          'value': '/articles/'
        },
        {
          'property': 'pathname',
          'operator': 'is not',
          'value': '/articles/null'
        }
      ])
    });

    // Make the request using fetch API
    const response = await fetch(`https://api.usefathom.com/v1/aggregations?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response from Fathom API');
    }

    // Process the response using object literal and array methods
    const viewsData = data.reduce((acc, { pathname, pageviews }) => {
      const articleSlug = pathname.split('/')[2]; // Extract slug from /articles/slug

      if (articleSlug) {
        acc[articleSlug] = pageviews;
      }

      return acc;
    }, {});

    // Create the data directory if it doesn't exist
    const dataDir = join(__dirname, '..', 'src', 'data');
    await fs.mkdir(dataDir, { recursive: true }).catch(() => {});

    // Write the views data to a JSON file
    const viewsFilePath = join(dataDir, 'article-views.json');
    await fs.writeFile(viewsFilePath, JSON.stringify(viewsData, null, 2));

    console.log('Successfully retrieved and stored article views');

  } catch (error) {
    console.error('Error retrieving page views:', error.message);
    process.exit(1);
  }
}

// Run the main function using top-level await
await retrievePageViews();
