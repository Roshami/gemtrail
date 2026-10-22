import React from 'react';
import { BookOpen, Sparkles, Compass, Shield, Award } from 'lucide-react';

export const StoriesGuidesView = () => {
  return (
    <div className="max-w-360 mx-auto px-3 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-[#705c30] text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Cultural Lore &amp; Gemological Guides</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f2622]">
          Stories &amp; Heritage Guides
        </h1>
        <p className="text-sm sm:text-base text-[#555d56] mt-2 leading-relaxed">
          Centuries of folk songs (Kamath Kavi &amp; Pathal Kavi), monastic chronicles, and royal edicts weave through the misty valleys of Sabaragamuwa.
        </p>
      </div>

      {/* Featured Story Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Story 1 */}
        <div className="bg-[#fdfbf7] rounded-xl p-6 sm:p-8 border border-[#ded5c5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#705c30] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ancient Chronicle</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1f2622] mb-3">
              Sumana Saman: Guardian of the Subterranean Gem Beds
            </h2>
            <p className="text-sm text-[#48504a] leading-relaxed mb-4">
              According to Buddhist legend, Maha Sumana Saman was the guardian prince of Adam’s Peak (Sri Pada). He vowed to protect the sacred soil and entrusted the underground corundum veins to honest artisans who live in harmony with the forest. To this day, miners observe strict vows of sobriety and non-violence before descending into the pit.
            </p>
          </div>
          <div className="pt-4 border-t border-[#eee5d8] text-xs font-medium text-[#4a7c59]">
            Source: Rajavaliya &amp; Sabaragamuwa Mahavamsa Traditions
          </div>
        </div>

        {/* Story 2 */}
        <div className="bg-[#fdfbf7] rounded-xl p-6 sm:p-8 border border-[#ded5c5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#705c30] text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Gemological Masterclass</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1f2622] mb-3">
              Decoding the Asterism of Ceylon Star Sapphires
            </h2>
            <p className="text-sm text-[#48504a] leading-relaxed mb-4">
              When illuminated by a single direct point source of light, a true Ceylon Star Sapphire reveals a sharp, intersecting six-rayed star that glides effortlessly across the domed cabochon. This optical phenomenon (asterism) is produced by microscopic rutile needle inclusions (silk) aligned at 60-degree angles along the basal planes of the hexagonal crystal.
            </p>
          </div>
          <div className="pt-4 border-t border-[#eee5d8] text-xs font-medium text-[#4a7c59]">
            Field Tip: Test using sunlight or penlight directly above the dome
          </div>
        </div>

        {/* Story 3 */}
        <div className="bg-[#fdfbf7] rounded-xl p-6 sm:p-8 border border-[#ded5c5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#705c30] text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Silk Road History</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1f2622] mb-3">
              King Solomon &amp; The Gems of Taprobane
            </h2>
            <p className="text-sm text-[#48504a] leading-relaxed mb-4">
              Biblical histories recount that King Solomon sent merchant fleets across the Indian Ocean to the ancient ports of Taprobane (Sri Lanka) to procure glowing blue corundum and rubies to court the Queen of Sheba. Marco Polo recorded in 1292 that "the island produces more precious rubies and sapphires than any other place in the known world."
            </p>
          </div>
          <div className="pt-4 border-t border-[#eee5d8] text-xs font-medium text-[#4a7c59]">
            Archival Note: The Travels of Marco Polo, Chapter 168
          </div>
        </div>

        {/* Story 4 */}
        <div className="bg-[#fdfbf7] rounded-xl p-6 sm:p-8 border border-[#ded5c5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#705c30] text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Environmental Code</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1f2622] mb-3">
              The Eco-Mining Covenant of Ratnapura
            </h2>
            <p className="text-sm text-[#48504a] leading-relaxed mb-4">
              Unlike open-pit scarred landscapes found in other mineral nations, Sri Lanka’s traditional pit mining requires that every excavated donawa shaft must be backfilled with original topsoil and replanted within 90 days of decommissioning. This preserves the surrounding rubber and tea plantations and guards against flash flooding.
            </p>
          </div>
          <div className="pt-4 border-t border-[#eee5d8] text-xs font-medium text-[#4a7c59]">
            Charter: National Gem &amp; Jewellery Authority Environmental Guidelines
          </div>
        </div>

      </div>

    </div>
  );
};
