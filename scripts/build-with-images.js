const fs = require('fs');
const path = require('path');
const { scrapePortfolioImages } = require('./scrape-portfolio-images');

/**
 * Build-time script that generates portfolio data with scraped images
 * This can be called during the build process to create optimized portfolio data
 */
async function buildWithImages() {
  try {
    console.log('Building portfolio data with images...');

    // Read source portfolios data
    const portfoliosPath = path.join(__dirname, '../data/portfolios.json');
    const sourcePortfolios = JSON.parse(fs.readFileSync(portfoliosPath, 'utf8'));

    // Scrape images and get updated data
    const updatedPortfolios = await scrapePortfolioImages(sourcePortfolios);

    // Write to a build-specific location (could be used by the app)
    const buildDataPath = path.join(__dirname, '../public/portfolio-data.json');
    fs.writeFileSync(buildDataPath, JSON.stringify(updatedPortfolios, null, 2));

    console.log(`Build data written to: ${buildDataPath}`);
    console.log('Build with images completed successfully!');

    return updatedPortfolios;
  } catch (error) {
    console.error('Build with images failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  buildWithImages()
    .then(() => {
      console.log('Build script finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Build script failed:', error);
      process.exit(1);
    });
}

module.exports = { buildWithImages };