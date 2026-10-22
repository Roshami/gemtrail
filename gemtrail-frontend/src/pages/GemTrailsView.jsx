import React, { useState } from 'react';
import { Compass, Layers } from 'lucide-react';

export const GemTrailsView = () => {
  const [activeStep, setActiveStep] = useState(0);

  const miningSteps = [
    {
      step: '01',
      title: 'Pit Sinking (Donawa & Yati Piti)',
      desc: 'Shafts are excavated 10 to 30 meters deep using rubber and Kekuna wood cribbing to reinforce soft clay walls without synthetic shoring. Miners work in teams using hand chisels and woven baskets.',
      tool: 'Hand chisels, wooden winches, rubber timber poles'
    },
    {
      step: '02',
      title: 'Illama Extraction',
      desc: 'Once miners strike the ancient gravel stratum (illama) deposited millions of years ago by prehistoric river courses, they haul the gravel-rich matrix up to the surface in woven cane buckets.',
      tool: 'Illama baskets, bucket pulleys, mud bailers'
    },
    {
      step: '03',
      title: 'Centrifugal Washing (Nambiliya)',
      desc: 'The gravel is carried to a nearby river or sluice pool. Using conical bamboo baskets called "Nambiliya", artisan panners swirl the mixture in circular patterns to float away light silts, leaving heavy corundum at the bottom.',
      tool: 'Conical bamboo nambiliya, river sluice boxes'
    },
    {
      step: '04',
      title: 'Daylight Sorting & Valuation',
      desc: 'Under natural morning sunlight, the master sorter carefully inspects every crystal. Untreated Ceylon sapphires, star sapphires, and spinels are segregated by optical clarity, asterism, and hue.',
      tool: '10x triplet loupes, daylight inspection boards, dichroscopes'
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      
      {/* Title */}
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-[#705c30] text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>Sabaragamuwa Mineral Geology</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f2622]">
          Gem Trails &amp; Artisanal Mining
        </h1>
        <p className="text-sm sm:text-base text-[#555d56] mt-2 leading-relaxed">
          Sri Lanka is affectionately hailed as "Ratna-Dweepa" (The Island of Gems). For over 2,500 years, the alluvial valleys around Ratnapura have yielded the world's most prized sapphires, cat's eyes, and alexandrites.
        </p>
      </div>

      {/* 4 Mineral Belts of Sabaragamuwa */}
      <div className="mb-14">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1f2622] mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#4a7c59]" />
          <span>The Four Geological Corridors</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-[#fdfbf7] rounded-[12px] border border-[#ded5c5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#705c30]">Zone 01</span>
              <h3 className="font-serif text-lg font-bold text-[#1f2622] mt-1 mb-2">
                Kalu Ganga River Basin
              </h3>
              <p className="text-xs text-[#525a54] leading-relaxed mb-4">
                Alluvial gravels washed along the great river course. Famous for water-rolled cornflower blue sapphires and yellow corundum.
              </p>
            </div>
            <div className="pt-3 border-t border-[#eee5d8] text-[11px] font-medium text-[#4a7c59]">
              Method: River diving &amp; shoreline panning
            </div>
          </div>

          <div className="p-5 bg-[#fdfbf7] rounded-[12px] border border-[#ded5c5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#705c30]">Zone 02</span>
              <h3 className="font-serif text-lg font-bold text-[#1f2622] mt-1 mb-2">
                Kahawatte Deep Fault
              </h3>
              <p className="text-xs text-[#525a54] leading-relaxed mb-4">
                Rich underground corundum beds lying 15–30 meters beneath clay strata. The legendary origin of world-record Star Sapphires.
              </p>
            </div>
            <div className="pt-3 border-t border-[#eee5d8] text-[11px] font-medium text-[#4a7c59]">
              Method: Deep-shaft timbered pits (Donawa)
            </div>
          </div>

          <div className="p-5 bg-[#fdfbf7] rounded-[12px] border border-[#ded5c5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#705c30]">Zone 03</span>
              <h3 className="font-serif text-lg font-bold text-[#1f2622] mt-1 mb-2">
                Pelmadulla Illama Basin
              </h3>
              <p className="text-xs text-[#525a54] leading-relaxed mb-4">
                Extensive river terrace gravels. Known for exceptional variety including Padparadscha (lotus sunrise hue) and Chrysoberyl.
              </p>
            </div>
            <div className="pt-3 border-t border-[#eee5d8] text-[11px] font-medium text-[#4a7c59]">
              Method: Traditional centrifugal bamboo washing
            </div>
          </div>

          <div className="p-5 bg-[#fdfbf7] rounded-[12px] border border-[#ded5c5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#705c30]">Zone 04</span>
              <h3 className="font-serif text-lg font-bold text-[#1f2622] mt-1 mb-2">
                Kuruvita &amp; Eheliyagoda
              </h3>
              <p className="text-xs text-[#525a54] leading-relaxed mb-4">
                Highland runoff near Bopath Ella waterfall. Yields exceptional transparent red and purple spinels, zircon, and tourmaline crystals.
              </p>
            </div>
            <div className="pt-3 border-t border-[#eee5d8] text-[11px] font-medium text-[#4a7c59]">
              Method: Mountain wash sluices &amp; hill trenching
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 4-Step Traditional Mining Craft */}
      <div className="bg-[#f5efe3] rounded-[12px] p-6 sm:p-10 border border-[#ded5c5] shadow-xs">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#705c30]">Ethical Handcrafted Extraction</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f2622] mt-1">
            The Traditional 4-Stage Mining Cycle
          </h2>
          <p className="text-xs sm:text-sm text-[#555d56] mt-2">
            Sri Lankan mining law strictly bans mechanized open-cast bulldozing to prevent environmental erosion of our lush rainforests. Every gem is harvested by hand.
          </p>
        </div>

        {/* Step tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {miningSteps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 rounded-[12px] text-left transition-all cursor-pointer border ${
                activeStep === idx
                  ? 'bg-white border-[#4a7c59] shadow-sm ring-1 ring-[#4a7c59]'
                  : 'bg-[#ede5d6] border-[#ded5c5] hover:bg-[#e4dbca]'
              }`}
            >
              <span className={`text-xs font-mono font-bold ${activeStep === idx ? 'text-[#4a7c59]' : 'text-[#705c30]'}`}>
                Stage {s.step}
              </span>
              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#1f2622] mt-0.5 line-clamp-1">
                {s.title.split('(')[0]}
              </h4>
            </button>
          ))}
        </div>

        {/* Active step display */}
        <div className="bg-white/80 rounded-[12px] p-6 sm:p-8 border border-[#ded5c5]">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-full bg-[#4a7c59] text-white font-bold text-xs flex items-center justify-center">
              {miningSteps[activeStep].step}
            </span>
            <h3 className="font-serif text-xl font-bold text-[#1f2622]">
              {miningSteps[activeStep].title}
            </h3>
          </div>
          <p className="text-sm text-[#48504a] leading-relaxed mb-4 max-w-3xl">
            {miningSteps[activeStep].desc}
          </p>
          <div className="p-3 bg-[#faf6f0] rounded-[12px] border border-[#ded5c5] text-xs text-[#705c30]">
            <strong>Artisanal Tools:</strong> {miningSteps[activeStep].tool}
          </div>
        </div>

      </div>

    </div>
  );
};
