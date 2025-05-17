# Article View Count Retrieval

This directory contains scripts for retrieving and updating article view counts from Fathom Analytics.

## Overview

The `retrieve-page-views.js` script fetches view counts for articles from Fathom Analytics and stores them in a JSON file that can be used by the Astro templates to display view counts on the website.

## How it Works

1. The script makes a request to the Fathom Analytics API to get page view data for URLs matching the pattern `/articles/`.
2. It extracts the article slug from each URL and associates it with the view count.
3. The data is stored in `src/data/article-views.json` as a simple key-value object where the keys are article slugs and the values are view counts.
4. Astro templates read this JSON file to display view counts on the website.

## GitHub Actions Integration

A GitHub Actions workflow is set up to run this script every 24 hours. The workflow:

1. Runs the script to fetch the latest view counts
2. Commits and pushes any changes to the article-views.json file

### Setup Requirements

To use this script with GitHub Actions, you need to:

1. Add your Fathom Analytics API token as a GitHub repository secret named `FATHOM_TOKEN`
2. Ensure the GitHub Actions workflow has permission to push to the repository

## Manual Execution

You can also run the script manually:

```bash
# Set your Fathom API token
export FATHOM_TOKEN=your_fathom_api_token

# Run the script
node scripts/retrieve-page-views.js
```

## Troubleshooting

If you encounter issues:

1. Check that your Fathom API token is valid and has the necessary permissions
2. Verify that the site ID in the script (`XCVRIKRE`) matches your Fathom site ID
3. Ensure the URL pattern in the filters matches your article URL structure