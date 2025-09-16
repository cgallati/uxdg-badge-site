import PortfolioTile from './PortfolioTile';
import portfoliosData from '../../../data/portfolios.json';

interface Portfolio {
  name: string;
  portfolioUrl: string;
  imageUrl: string | null;
  localImage: string | null;
}

export default function PortfolioGallery() {
  const portfolios = portfoliosData as Portfolio[];
  
  // Filter out portfolios without images
  const validPortfolios = portfolios.filter(portfolio => portfolio.localImage);

  return (
    <div className="w-full">
      {/* Gallery Header */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">Student Portfolios</h2>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
          Explore the creative work of our UX Design students. Tap any portfolio to visit their site.
        </p>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
        {validPortfolios.map((portfolio, index) => (
          <PortfolioTile
            key={index}
            name={portfolio.name}
            portfolioUrl={portfolio.portfolioUrl}
            localImage={portfolio.localImage!}
          />
        ))}
      </div>
    </div>
  );
}