const fs = require('fs');
const path = require('path');
const https = require('https');
const { JSDOM } = require('jsdom');

async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`Following redirect from ${url} to ${res.headers.location}`);
        return fetchHTML(res.headers.location).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
    
    // Set timeout to avoid hanging
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
  });
}

async function downloadImage(imageUrl, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    const request = https.get(imageUrl, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(filename); // Clean up empty file
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filename); // Clean up empty file
        reject(new Error(`HTTP ${res.statusCode} for ${imageUrl}`));
        return;
      }
      
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filename)) {
        fs.unlinkSync(filename); // Clean up on error
      }
      reject(err);
    });
    
    // Set timeout
    request.setTimeout(15000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
      }
      reject(new Error(`Download timeout for ${imageUrl}`));
    });
  });
}

function findBestImage(dom, baseUrl) {
  // Look for prominent images in common selectors
  const selectors = [
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
    '.hero img',
    '.banner img',
    '.portfolio-image img',
    'main img',
    'article img',
    'img[src*="hero"]',
    'img[src*="banner"]',
    'img[src*="portfolio"]'
  ];

  for (const selector of selectors) {
    const element = dom.window.document.querySelector(selector);
    if (element) {
      let src = element.getAttribute('content') || element.getAttribute('src');
      if (src) {
        // Convert relative URLs to absolute
        if (src.startsWith('/')) {
          const url = new URL(baseUrl);
          src = `${url.protocol}//${url.host}${src}`;
        } else if (!src.startsWith('http')) {
          src = new URL(src, baseUrl).href;
        }
        return src;
      }
    }
  }

  // Fallback: find the largest image
  const images = dom.window.document.querySelectorAll('img');
  let bestImage = null;
  let maxSize = 0;

  for (const img of images) {
    const width = parseInt(img.getAttribute('width') || '0');
    const height = parseInt(img.getAttribute('height') || '0');
    const size = width * height;
    
    if (size > maxSize && img.src) {
      maxSize = size;
      bestImage = img.src;
    }
  }

  if (bestImage && !bestImage.startsWith('http')) {
    const url = new URL(baseUrl);
    bestImage = bestImage.startsWith('/') 
      ? `${url.protocol}//${url.host}${bestImage}`
      : new URL(bestImage, baseUrl).href;
  }

  return bestImage;
}

async function scrapePortfolioImages() {
  console.log('Starting portfolio image scraping...');
  
  // Read the portfolios data
  const portfoliosPath = path.join(__dirname, '../data/portfolios.json');
  const portfolios = JSON.parse(fs.readFileSync(portfoliosPath, 'utf8'));
  
  // Ensure public/portfolio-images directory exists
  const imagesDir = path.join(__dirname, '../public/portfolio-images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const updatedPortfolios = [];

  for (let i = 0; i < portfolios.length; i++) {
    const portfolio = portfolios[i];
    console.log(`Processing ${portfolio.name} (${i + 1}/${portfolios.length})...`);

    try {
      console.log(`Scraping: ${portfolio.portfolioUrl}`);
      
      // Fetch and parse the portfolio website
      const html = await fetchHTML(portfolio.portfolioUrl);
      const dom = new JSDOM(html);
      const imageUrl = findBestImage(dom, portfolio.portfolioUrl);
      
      if (!imageUrl) {
        console.log(`⚠ No suitable image found for ${portfolio.name}`);
        updatedPortfolios.push({
          ...portfolio,
          imageUrl: null,
          localImage: null
        });
        continue;
      }
      
      const filename = `portfolio-${i + 1}.jpg`;
      const localPath = path.join(imagesDir, filename);
      
      // Download the scraped image
      await downloadImage(imageUrl, localPath);
      
      updatedPortfolios.push({
        ...portfolio,
        imageUrl: imageUrl,
        localImage: `/portfolio-images/${filename}`
      });
      
      console.log(`✓ Downloaded image for ${portfolio.name} from ${imageUrl}`);
      
    } catch (error) {
      console.error(`✗ Failed to process ${portfolio.name}:`, error.message);
      
      // Add portfolio without image
      updatedPortfolios.push({
        ...portfolio,
        imageUrl: null,
        localImage: null
      });
    }

    // Add delay to be respectful to servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Write updated portfolios data
  fs.writeFileSync(portfoliosPath, JSON.stringify(updatedPortfolios, null, 2));
  console.log('Portfolio image scraping completed!');
}

// Run if called directly
if (require.main === module) {
  scrapePortfolioImages()
    .then(() => {
      console.log('Script finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { scrapePortfolioImages };