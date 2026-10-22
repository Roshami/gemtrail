import React from 'react';
import { Info, Mountain, ShieldCheck } from 'lucide-react';
import { DISTRICT_INFO } from '../data/ratnapuraPlaces.js';

export const AboutSabaragamuwaView = () => {
  return (
    <div className="max-w-360 mx-auto px-3 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      
      {/* Title */}
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-[#705c30] text-xs font-bold uppercase tracking-wider mb-2">
          <Info className="w-4 h-4" />
          <span>Regional Monograph</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f2622]">
          About Sabaragamuwa Province
        </h1>
        <p className="text-sm sm:text-base text-[#555d56] mt-2 leading-relaxed">
          Nestled between the rugged southern escarpment of the Central Highlands and the southwestern coastal plains, Ratnapura District is a geological wonder formed over two billion years ago.
        </p>
      </div>

      {/* Vital Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="p-5 bg-[#fdfbf7] rounded-xl border border-[#ded5c5]">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#705c30]">Total Area</span>
          <p className="font-serif text-2xl font-bold text-[#1f2622] mt-1">{DISTRICT_INFO.areaKm2}</p>
          <span className="text-xs text-[#666]">Forested basin</span>
        </div>

        <div className="p-5 bg-[#fdfbf7] rounded-xl border border-[#ded5c5]">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#705c30]">Elevation</span>
          <p className="font-serif text-2xl font-bold text-[#1f2622] mt-1">30m – 2,243m</p>
          <span className="text-xs text-[#666]">Peak: Sri Pada summit</span>
        </div>

        <div className="p-5 bg-[#fdfbf7] rounded-xl border border-[#ded5c5]">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#705c30]">Gem Varieties</span>
          <p className="font-serif text-2xl font-bold text-[#1f2622] mt-1">{DISTRICT_INFO.gemVarietiesCount}+ Types</p>
          <span className="text-xs text-[#666]">Out of 200 known minerals</span>
        </div>

        <div className="p-5 bg-[#fdfbf7] rounded-xl border border-[#ded5c5]">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#705c30]">Mining Heritage</span>
          <p className="font-serif text-2xl font-bold text-[#1f2622] mt-1">2,500+ Yrs</p>
          <span className="text-xs text-[#666]">Continuous artisan extraction</span>
        </div>
      </div>

      {/* Deep Geological Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#f5efe3] rounded-xl p-6 sm:p-8 border border-[#ded5c5]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1f2622] mb-3 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-[#4a7c59]" />
            <span>The Highland Granulite Complex</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed mb-4">
            During the assembly of the ancient Gondwana supercontinent, high-grade metamorphic events deep inside the Earth’s mantle subjected aluminum-rich sediments to temperatures exceeding 800°C and immense pressures. Corundum (Al₂O₃) crystallized alongside chrysoberyl and spinel.
          </p>
          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed">
            Over hundreds of millions of years, tropical rainfall eroded the granite mountains, washing heavier gemstone crystals down into ancient river valleys and terrace basins. This dense sediment layer is known today as <em>illama</em>.
          </p>
        </div>

        <div className="bg-[#f5efe3] rounded-xl p-6 sm:p-8 border border-[#ded5c5]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1f2622] mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4a7c59]" />
            <span>Biosphere &amp; Rainforest Stewardship</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed mb-4">
            Ratnapura District is guardian to the Sinharaja Biosphere Reserve—a UNESCO World Heritage primeval forest that acts as the watershed sponge for southwestern Sri Lanka.
          </p>
          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed">
            By rejecting industrial hydraulic strip-mining, the district protects endemic birds like the Sri Lanka Blue Magpie, rare tree frogs, and cascading headwaters that feed downstream tea and paddy agriculture.
          </p>
        </div>
      </div>

    </div>
  );
};
