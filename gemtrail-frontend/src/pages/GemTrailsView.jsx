import React, { useState } from 'react';
import { Compass, Layers } from 'lucide-react';

export const GemTrailsView = () => {
  const [activeStep, setActiveStep] = useState(0);

  const miningSteps = [
    {
      step: '01',
      title: 'Preparing the Gem Pit',
      desc: 'Traditional gem mining in Ratnapura often begins by identifying a suitable location where gem-bearing gravel may be found. Workers prepare the site and excavate a pit using appropriate tools. Where necessary, timber supports are used to help stabilize the sides of the excavation.',
      tool: 'Digging tools, ropes, timber supports and safety equipment'
    },
    {
      step: '02',
      title: 'Extracting Gem-Bearing Gravel',
      desc: 'Miners collect gravel deposits locally known as "illama", which may contain gemstones. The gravel is brought to the surface for further processing. The depth, layout and method of extraction depend on the geological conditions and the individual mining site.',
      tool: 'Baskets, buckets, ropes and gravel-handling equipment'
    },
    {
      step: '03',
      title: 'Washing and Separating Gravel',
      desc: 'The extracted gravel is washed with water to remove clay, sand and lighter materials. Traditional workers may use baskets and manual washing techniques to separate heavier mineral grains. The remaining material is examined carefully for possible gemstones.',
      tool: 'Washing baskets, sieves, water channels and sorting trays'
    },
    {
      step: '04',
      title: 'Identifying and Sorting Gemstones',
      desc: 'Potential gemstones are separated from the remaining gravel and examined for their characteristics. Colour, transparency, clarity, size and other identifying features help distinguish different stones. Gem specialists may assess their quality and suitability for cutting, jewellery or further evaluation.',
      tool: 'Sorting trays, tweezers, magnifying loupes and inspection lights'
    }
  ];

  const gemAreas = [
    {
      number: '01',
      title: 'Ratnapura Town',
      desc: 'Known as Sri Lanka’s City of Gems, Ratnapura is an important centre for the gem trade. Visitors can learn about gemstone buying, selling, identification and the role of the gem industry in local livelihoods.',
      highlight: 'Focus: Gem markets and local gem heritage'
    },
    {
      number: '02',
      title: 'Kalu Ganga River Basin',
      desc: 'River systems and their surrounding deposits are part of the region’s alluvial landscape. Gem-bearing gravel can occur in suitable sediment deposits, although the presence and type of gemstones vary from site to site.',
      highlight: 'Focus: Rivers and alluvial deposits'
    },
    {
      number: '03',
      title: 'Pelmadulla and Surrounding Areas',
      desc: 'The wider Ratnapura region includes communities associated with Sri Lanka’s traditional gem-mining industry. Local mining practices provide insight into the skills, tools and knowledge passed between generations.',
      highlight: 'Focus: Traditional mining communities'
    },
    {
      number: '04',
      title: 'Kuruvita and Eheliyagoda',
      desc: 'These areas are part of the wider Ratnapura District, known for its green landscapes, waterways and rural communities. They can provide a broader view of the natural and cultural setting in which regional livelihoods have developed.',
      highlight: 'Focus: Rural landscapes and local culture'
    }
  ];

  return (
    <div className="max-w-360 mx-auto px-3 sm:px-6 lg:px-8 py-8 animate-in fade-in">

      {/* Page Header */}
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-[#705c30] text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>Ratnapura District • Gem Heritage</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f2622]">
          Gem Trails &amp; Traditional Mining
        </h1>

        <p className="text-sm sm:text-base text-[#555d56] mt-2 leading-relaxed">
          Discover the gem heritage of Ratnapura, one of Sri Lanka’s best-known
          gemstone centres. Explore the traditional mining process, learn how
          gem-bearing gravel is washed and sorted, and understand the importance
          of gemstones to the district’s culture, trade and local livelihoods.
        </p>
      </div>

      {/* Ratnapura Gem Heritage Areas */}
      <div className="mb-14">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1f2622] mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#4a7c59]" />
          <span>Explore Ratnapura’s Gem Heritage</span>
        </h2>

        <p className="text-sm text-[#555d56] leading-relaxed mb-6 max-w-3xl">
          Ratnapura’s gem heritage extends beyond mining sites. The district’s
          towns, rivers and rural communities help tell the story of gemstone
          discovery, traditional skills and the local gem trade.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gemAreas.map((area) => (
            <div
              key={area.number}
              className="p-5 bg-[#fdfbf7] rounded-xl border border-[#ded5c5] shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#705c30]">
                  Area {area.number}
                </span>

                <h3 className="font-serif text-lg font-bold text-[#1f2622] mt-1 mb-2">
                  {area.title}
                </h3>

                <p className="text-xs text-[#525a54] leading-relaxed mb-4">
                  {area.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#eee5d8] text-[11px] font-medium text-[#4a7c59]">
                {area.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traditional Gem Mining Process */}
      <div className="bg-[#f5efe3] rounded-xl p-6 sm:p-10 border border-[#ded5c5] shadow-xs">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#705c30]">
            Local Knowledge &amp; Traditional Skills
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f2622] mt-1">
            The Four Stages of Traditional Gem Mining
          </h2>

          <p className="text-xs sm:text-sm text-[#555d56] mt-2 leading-relaxed">
            Explore the main stages commonly associated with traditional
            alluvial gem mining in Sri Lanka. Actual methods vary depending on
            the site, local practices and working conditions. Responsible
            mining requires suitable authorization, worker safety and care for
            the surrounding environment.
          </p>
        </div>

        {/* Stage Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {miningSteps.map((step, idx) => (
            <button
              key={step.step}
              onClick={() => setActiveStep(idx)}
              aria-pressed={activeStep === idx}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer border ${
                activeStep === idx
                  ? 'bg-white border-[#4a7c59] shadow-sm ring-1 ring-[#4a7c59]'
                  : 'bg-[#ede5d6] border-[#ded5c5] hover:bg-[#e4dbca]'
              }`}
            >
              <span
                className={`text-xs font-mono font-bold ${
                  activeStep === idx
                    ? 'text-[#4a7c59]'
                    : 'text-[#705c30]'
                }`}
              >
                Stage {step.step}
              </span>

              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#1f2622] mt-0.5 line-clamp-2">
                {step.title}
              </h4>
            </button>
          ))}
        </div>

        {/* Selected Stage Details */}
        <div
          className="bg-white/80 rounded-xl p-6 sm:p-8 border border-[#ded5c5]"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 shrink-0 rounded-full bg-[#4a7c59] text-white font-bold text-xs flex items-center justify-center">
              {miningSteps[activeStep].step}
            </span>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1f2622]">
              {miningSteps[activeStep].title}
            </h3>
          </div>

          <p className="text-sm text-[#48504a] leading-relaxed mb-4 max-w-3xl">
            {miningSteps[activeStep].desc}
          </p>

          <div className="p-3 bg-[#faf6f0] rounded-xl border border-[#ded5c5] text-xs text-[#705c30] leading-relaxed">
            <strong>Tools and Equipment:</strong>{' '}
            {miningSteps[activeStep].tool}
          </div>
        </div>

        {/* Responsible Tourism Note */}
        <div className="mt-6 p-4 bg-white/60 rounded-xl border border-[#ded5c5]">
          <h3 className="font-serif text-base font-bold text-[#1f2622] mb-1">
            Discover Gem Heritage Responsibly
          </h3>

          <p className="text-xs sm:text-sm text-[#555d56] leading-relaxed">
            Mining sites can present serious hazards, including unstable ground
            and deep excavations. Visit only authorized locations, follow local
            guidance and never enter an active mine without permission and
            appropriate safety arrangements. Support local communities while
            helping protect Ratnapura’s natural environment and cultural
            heritage.
          </p>
        </div>
      </div>
    </div>
  );
};