import React from 'react';
import {
  Search,
  ChevronDown,
  Compass,
  MapPin,
  Layers,
  History,
  Diamond,
} from 'lucide-react';

export const HeroSection = ({
  searchQuery,
  onSearchChange,
  radiusKm,
  onRadiusChange,
  onExploreClick,
  onOpenMapClick,
}) => {
  const handlePopularSearch = (term) => {
    onSearchChange(term);
    onExploreClick();
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#1b261e] text-white min-h-130 flex items-center justify-center pt-8 pb-16">
      {/* Top Left Floating Weather Badge */}
      <div className="absolute top-8 left-8 sm:left-12 z-20 hidden sm:flex items-center gap-2.5 bg-white/15 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full text-xs shadow-lg text-white">
        <span className="flex items-center gap-1.5 font-medium text-white">
          <MapPin className="text-[#8ecf9e] w-4 h-4" />
          <span>Ratnapura</span>
        </span>
        <span className="w-px h-3.5 bg-white/25"></span>
        <span className="flex items-center gap-1.5 text-[#f8e0a8] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>27°C • Mist</span>
        </span>
      </div>

      {/* Cinematic Background Image with Dual Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMpSaYTcUGR_2uBWo3hQT_x0NnEMfj0MaUFumtGqiGutCDMs8l_LJnoUED36egjbeER6_1xZ51fhgPYy1o_ekkfSYgW94LsSrcd8HC1vwnocyAJsQdtGstNPiI6eTqhGSUcBDjYNOqX5d2CrlT-A3nFn9PkXU_YzhjnyiBoDxz60Ch-4UhWUyBzHKLxViKb45q0a8ULWPzVazbblkGHmXif0giaQs4QWaY8LeR3BG2Vfp_45EnXL6F"
          alt="Panoramic cinematic aerial photograph of lush tropical misty mountain valley in Ratnapura Sri Lanka"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1b261e]/85 via-[#1b261e]/75 to-[#1b261e]/95"></div>
        <div className="absolute inset-0 bg-radial from-transparent via-[#1b261e]/30 to-[#1b261e]/80"></div>
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center">
        {/* Sub-kicker editorial line */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase mb-5 text-[#8ecf9e]">
          <Diamond className="w-3.5 h-3.5 text-[#8ecf9e]" />
          <span>Ratnapura District, Sabaragamuwa Province, Sri Lanka</span>
          <span className="opacity-50">·</span>
          <span className="text-white/80 font-normal">
            The Ancient Gem Capital
          </span>
        </div>

        {/* Hero Headline with text-wrap: balance */}
        <h1
          className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl drop-shadow-sm"
          style={{ textWrap: 'balance' }}
        >
          Discover the City of Gems
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl font-normal leading-relaxed">
          Uncover centuries of artisanal mining heritage, emerald rainforest
          waterfalls, and sacred mountain pilgrimage trails nestled beneath
          misty peaks.
        </p>

        {/* Unboxed Metrics with typographic separators */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 text-xs text-white/90 font-medium">
          <div className="flex items-center gap-1.5">
            <Compass className="text-[#8ecf9e] w-4 h-4" />
            <span>44 Verified Landmarks</span>
          </div>

          <span className="text-white/40">·</span>

          <div className="flex items-center gap-1.5">
            <Layers className="text-[#f8e0a8] w-4 h-4" />
            <span>3,275 km² District Coverage</span>
          </div>

          <span className="text-white/40">·</span>

          <div className="flex items-center gap-1.5">
            <History className="text-[#8ecf9e] w-4 h-4" />
            <span>2,000+ Years Gem Heritage</span>
          </div>
        </div>

        {/* Hero Interactive Search Strip */}
        <div className="w-full max-w-3xl mt-8">
          <div className="bg-[#faf6f0]/95 backdrop-blur-xl p-2 sm:p-2.5 rounded-xl shadow-2xl border border-white/30 text-[#2e3230] flex flex-col md:flex-row items-stretch md:items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3.5 text-[#74796e] w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search mines, waterfalls, temples, gem museums..."
                className="w-full bg-[#f0ece4] pl-11 pr-4 py-3 text-xs sm:text-sm text-[#2e3230] placeholder:text-[#74796e] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/40"
              />
            </div>

            {/* Radius Selector */}
            <div className="relative md:w-56 shrink-0">
              <select
                value={radiusKm}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                className="w-full appearance-none bg-[#f0ece4] px-3.5 py-3 text-xs text-[#2e3230] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/40 pr-8 font-semibold cursor-pointer"
              >
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={25}>Within 25 km (Default)</option>
                <option value={50}>Within 50 km</option>
                <option value={100}>Entire District Mask</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74796e] pointer-events-none w-4 h-4" />
            </div>

            {/* Explore Attractions Button */}
            <button
              onClick={onExploreClick}
              className="px-5 py-3 rounded-xl bg-[#4a7c59] text-white hover:bg-[#3b6548] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Attractions</span>
            </button>

            {/* View on Map Button */}
            {onOpenMapClick && (
              <button
                onClick={onOpenMapClick}
                className="px-4 py-3 rounded-xl bg-[#ede8df] hover:bg-white text-[#2e3230] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer border border-[#c4c8bc]/50"
              >
                <MapPin className="w-4 h-4 text-[#4a7c59]" />
                <span>Interactive Map</span>
              </button>
            )}
          </div>

          {/* Popular searches tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-white/80">
            <span className="text-white/60 font-semibold text-[11px] uppercase tracking-wider">
              Popular searches:
            </span>
            <button
              onClick={() => handlePopularSearch('Bopath Ella')}
              className="hover:text-white hover:underline transition-colors cursor-pointer"
            >
              Bopath Ella,
            </button>
            <button
              onClick={() => handlePopularSearch('Kahawatte')}
              className="hover:text-white hover:underline transition-colors cursor-pointer"
            >
              Kahawatte Mine,
            </button>
            <button
              onClick={() => handlePopularSearch('Saman Devalaya')}
              className="hover:text-white hover:underline transition-colors cursor-pointer"
            >
              Saman Devalaya,
            </button>
            <button
              onClick={() => handlePopularSearch('Kirindi Ella')}
              className="hover:text-white hover:underline transition-colors cursor-pointer"
            >
              Kirindi Falls
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
