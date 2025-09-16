import Image from 'next/image';

interface PortfolioTileProps {
  name: string;
  portfolioUrl: string;
  localImage: string;
}

export default function PortfolioTile({ name, portfolioUrl, localImage }: PortfolioTileProps) {
  const handleClick = () => {
    window.open(portfolioUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col">
      {/* Portfolio Image - Square tile */}
      <div 
        onClick={handleClick}
        className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
      >
        <Image
          src={localImage}
          alt={`${name}'s portfolio`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>
      
      {/* Name below tile */}
      <h3 className="text-white font-medium text-sm md:text-base text-center mt-4 px-2">
        {name}
      </h3>
    </div>
  );
}