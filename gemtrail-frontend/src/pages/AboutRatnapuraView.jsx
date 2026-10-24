import React from 'react';
import { Info, Mountain, ShieldCheck, Gem, Landmark, Droplets } from 'lucide-react';
import { DISTRICT_INFO } from '../data/ratnapuraPlaces.js';

export const AboutRatnapuraView = () => {
  return (
    <div className="max-w-360 mx-auto px-3 sm:px-6 lg:px-8 py-8 animate-in fade-in">

      {/* Title */}
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-[#705c30] text-xs font-bold uppercase tracking-wider mb-2">
          <Info className="w-4 h-4" />
          <span>Discover Sri Lanka</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f2622]">
          About Ratnapura District
        </h1>

        <p className="text-sm sm:text-base text-[#555d56] mt-3 leading-relaxed">
          Located in Sri Lanka's Sabaragamuwa Province, Ratnapura District
          is famous for its precious gemstones, beautiful waterfalls, lush
          forests, ancient religious sites, and rich cultural heritage.
          Known as the "City of Gems", Ratnapura offers visitors a unique
          combination of natural beauty, history, spirituality, and local
          traditions.
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">

        <div className="p-5 bg-[#fdfbf7] rounded-xl border border-[#ded5c5]">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#705c30]">
            District Area
          </span>
          <p className="font-serif text-2xl font-bold text-[#1f2622] mt-1">
            {DISTRICT_INFO.areaKm2}
          </p>
          <span className="text-xs text-[#666]">
            Land of mountains and forests
          </span>
        </div>

        <div className="p-5 bg-[#fdfbf7] rounded-xl border border-[#ded5c5]">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#705c30]">
            Famous For
          </span>
          <p className="font-serif text-2xl font-bold text-[#1f2622] mt-1">
            Gem City
          </p>
          <span className="text-xs text-[#666]">
            Precious stones and gem mining
          </span>
        </div>

        <div className="p-5 bg-[#fdfbf7] rounded-xl border border-[#ded5c5]">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#705c30]">
            Natural Beauty
          </span>
          <p className="font-serif text-2xl font-bold text-[#1f2622] mt-1">
            Waterfalls
          </p>
          <span className="text-xs text-[#666]">
            Bopath Ella and Kiri Ella
          </span>
        </div>

        <div className="p-5 bg-[#fdfbf7] rounded-xl border border-[#ded5c5]">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#705c30]">
            Heritage
          </span>
          <p className="font-serif text-2xl font-bold text-[#1f2622] mt-1">
            Rich History
          </p>
          <span className="text-xs text-[#666]">
            Temples, museums, and ancient sites
          </span>
        </div>
      </div>

      {/* District Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

        {/* Gem Industry */}
        <div className="bg-[#f5efe3] rounded-xl p-6 sm:p-8 border border-[#ded5c5]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1f2622] mb-3 flex items-center gap-2">
            <Gem className="w-5 h-5 text-[#4a7c59] shrink-0" />
            <span>The City of Gems</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed mb-4">
            Ratnapura is one of Sri Lanka's best-known gemstone-producing
            areas. The district is associated with valuable gemstones such
            as blue sapphires, rubies, star sapphires, garnets, and
            chrysoberyl. Its gem industry has supported local livelihoods
            and traditional craftsmanship for generations.
          </p>

          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed">
            Visitors can learn about traditional gem mining, gemstone
            trading, and the skills involved in identifying and cutting
            precious stones. The gem industry is an important part of
            Ratnapura's identity, economy, and cultural heritage.
          </p>
        </div>

        {/* Nature */}
        <div className="bg-[#f5efe3] rounded-xl p-6 sm:p-8 border border-[#ded5c5]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1f2622] mb-3 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-[#4a7c59] shrink-0" />
            <span>Mountains and Natural Landscapes</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed mb-4">
            Ratnapura District features green hills, rivers, forested
            landscapes, and scenic waterfalls. Its natural environment
            provides opportunities for sightseeing, photography, nature
            walks, and outdoor exploration.
          </p>

          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed">
            Attractions such as Bopath Ella, Kiri Ella, and Katugas Ella
            attract visitors who want to experience the district's natural
            beauty. Travellers should follow local safety guidance,
            especially near waterfalls, rivers, and slippery rocks.
          </p>
        </div>

        {/* Religious and Cultural Heritage */}
        <div className="bg-[#f5efe3] rounded-xl p-6 sm:p-8 border border-[#ded5c5]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1f2622] mb-3 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#4a7c59] shrink-0" />
            <span>Religious and Cultural Heritage</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed mb-4">
            Ratnapura has a long-standing religious and cultural tradition.
            Important places such as the Saman Devalaya reflect the area's
            spiritual heritage and attract pilgrims and visitors throughout
            the year.
          </p>

          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed">
            Temples, historic buildings, museums, and archaeological sites
            help visitors understand the district's history, customs, and
            cultural development. The Ratnapura National Museum is another
            place to explore local history and heritage.
          </p>
        </div>

        {/* Forests and Biodiversity */}
        <div className="bg-[#f5efe3] rounded-xl p-6 sm:p-8 border border-[#ded5c5]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1f2622] mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4a7c59] shrink-0" />
            <span>Forests and Biodiversity</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed mb-4">
            The district is connected to some of Sri Lanka's important
            natural habitats. The wider region includes the Sinharaja Forest
            Reserve, a UNESCO World Heritage Site known for its rich
            biodiversity and endemic wildlife.
          </p>

          <p className="text-xs sm:text-sm text-[#48504a] leading-relaxed">
            Forest conservation helps protect native plants, birds,
            amphibians, and other wildlife. Responsible tourism, avoiding
            litter, and respecting protected areas are important for
            preserving these environments for future generations.
          </p>
        </div>

      </div>

      {/* Water and Agriculture */}
      <div className="bg-[#fdfbf7] rounded-xl p-6 sm:p-8 border border-[#ded5c5] mb-12">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1f2622] mb-3 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-[#4a7c59] shrink-0" />
          <span>Rivers, Rainfall, and Rural Life</span>
        </h2>

        <p className="text-sm text-[#48504a] leading-relaxed mb-4">
          Ratnapura receives substantial rainfall during parts of the year,
          supporting its rivers, vegetation, and agricultural activities.
          The surrounding countryside includes tea and rubber cultivation,
          paddy fields, home gardens, and rural communities.
        </p>

        <p className="text-sm text-[#48504a] leading-relaxed">
          These landscapes contribute to the district's character and offer
          visitors an opportunity to experience local lifestyles alongside
          its natural and cultural attractions. Weather conditions can
          affect road travel and access to outdoor destinations, so checking
          local conditions before travelling is recommended.
        </p>
      </div>

      {/* GemTrail Project Connection */}
      <div className="bg-[#1f2622] rounded-xl p-6 sm:p-8 mb-8">
        <div className="text-[#d7bd82] text-xs font-bold uppercase tracking-wider mb-2">
          Explore with GemTrail
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
          Discover Ratnapura in One Day
        </h2>

        <p className="text-sm text-[#e4e7e2] leading-relaxed mb-4">
          GemTrail helps travellers discover attractions around Ratnapura
          and organize a convenient one-day visit. Explore natural
          attractions, religious landmarks, historical places, and local
          points of interest in one place.
        </p>

        <p className="text-sm text-[#e4e7e2] leading-relaxed">
          Use the available place information, distance filters, map
          directions, travel tips, and itinerary planner to choose
          destinations that match your interests and available time.
          Opening hours, entrance fees, and travel estimates should be
          checked before departure when available.
        </p>
      </div>

    </div>
  );
};