import React, { useState } from 'react';
import { Diamond, ShieldCheck, ArrowRight } from 'lucide-react';

export const Footer = ({
  onNavigateTab,
  onSelectAttractionByName
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="bg-[#ede7da] border-t border-[#ded5c5] pt-14 pb-8 text-[#4a524c]">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#ded5c5]">
          
          {/* Col 1: Brand & Endorsement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4a7c59] text-white flex items-center justify-center">
                <Diamond className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold text-[#1f2622] tracking-tight">
                GemTrail
              </span>
            </div>

            <p className="text-xs text-[#5c645e] leading-relaxed">
              The definitive heritage portal honoring the City of Gems. Unearthing three millennia of artisan mining, rainforest sanctuaries, and hill country legacy.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#705c30] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#4a7c59]" />
              <span>Ceylon Gem Bureau Endorsed</span>
            </div>
          </div>

          {/* Col 2: Heritage & Mines */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#1f2622] tracking-wide">
              Heritage &amp; Mines
            </h4>
            <ul className="space-y-2 text-xs text-[#525a54]">
              <li>
                <button
                  onClick={() => onSelectAttractionByName('Kahawatte Gem Pit Exploration')}
                  className="hover:text-[#1f2622] hover:underline cursor-pointer text-left"
                >
                  Kahawatta Traditional Mines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectAttractionByName('Batuwita Kalu Ganga River Panning')}
                  className="hover:text-[#1f2622] hover:underline cursor-pointer text-left"
                >
                  Batuwita River Panning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectAttractionByName('National Gem Museum')}
                  className="hover:text-[#1f2622] hover:underline cursor-pointer text-left"
                >
                  National Gem Museum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('trails')}
                  className="hover:text-[#1f2622] hover:underline cursor-pointer text-left"
                >
                  Artisan Lapidary Workshops
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Expeditions */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#1f2622] tracking-wide">
              Expeditions
            </h4>
            <ul className="space-y-2 text-xs text-[#525a54]">
              <li>
                <button
                  onClick={() => onSelectAttractionByName("Sri Pada (Adam's Peak) Foothill Trail")}
                  className="hover:text-[#1f2622] hover:underline cursor-pointer text-left"
                >
                  Adam's Peak (Sri Pada) Trail
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectAttractionByName('Sinharaja Biosphere Gateway')}
                  className="hover:text-[#1f2622] hover:underline cursor-pointer text-left"
                >
                  Sinharaja Rainforest Fringe
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectAttractionByName('Bopath Ella Falls')}
                  className="hover:text-[#1f2622] hover:underline cursor-pointer text-left"
                >
                  Bopath Ella Cascades
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('planner')}
                  className="hover:text-[#1f2622] hover:underline cursor-pointer text-left"
                >
                  Curate 3-Day Gem Safari
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: District Dispatch Newsletter */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#1f2622] tracking-wide">
              District Dispatch
            </h4>
            <p className="text-xs text-[#5c645e] leading-relaxed">
              Receive monthly chronicles on rare sapphire finds, rain-forest conservancy notes, and seasonal trails.
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={subscribed ? 'Subscribed successfully!' : 'Your email address'}
                disabled={subscribed}
                className="w-full bg-[#fdfbf7] text-xs px-3.5 py-2.5 pr-11 rounded-xl border border-[#ded5c5] focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/20 text-[#1f2622] placeholder:text-[#888e89]"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="absolute right-1.5 p-1.5 rounded-lg bg-[#4a7c59] hover:bg-[#3a6346] text-white transition-colors cursor-pointer disabled:opacity-50"
                title="Subscribe to dispatch"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <span className="text-[11px] text-[#2e683e] font-semibold block animate-in fade-in">
                ✓ Thank you for subscribing to Sabaragamuwa chronicles!
              </span>
            )}
          </div>

        </div>

        {/* Bottom Attribution Bar */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#6e7770]">
          <div>
            © 2024 GemTrail District Authority. Rooted in the soil of Sabaragamuwa Province.
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button 
              onClick={() => onNavigateTab('about')}
              className="hover:text-[#1f2622] transition-colors cursor-pointer"
            >
              Conservation Charter
            </button>
            <span className="text-[#bbb]">·</span>
            <button 
              onClick={() => onNavigateTab('stories')}
              className="hover:text-[#1f2622] transition-colors cursor-pointer"
            >
              Local Miner Ethics
            </button>
            <span className="text-[#bbb]">·</span>
            <button 
              onClick={() => onNavigateTab('about')}
              className="hover:text-[#1f2622] transition-colors cursor-pointer"
            >
              Accessibility
            </button>
            <span className="text-[#bbb]">·</span>
            <button 
              onClick={() => onNavigateTab('admin')}
              className="hover:text-[#2d6a4f] text-[#2d6a4f] font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              🔒 Admin CMS
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
