import { Link } from 'react-router-dom';

function PlaceCard({ place }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {/* Temporary image area */}
        <div className="w-full h-full bg-linear-to-br from-green-800 via-green-600 to-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <span className="text-6xl">🌿</span>
        </div>

        {/* Category */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold rounded-full">
          {place.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-yellow-600 font-semibold">
            ★ {place.rating}
          </span>

          <span className="text-sm font-semibold text-green-700">
            {place.fee}
          </span>
        </div>

        {/* Name */}
        <h2 className="mt-3 text-xl font-bold text-gray-900 line-clamp-1">
          {place.name}
        </h2>

        {/* Location */}
        <p className="mt-2 text-sm text-gray-500">📍 {place.location}</p>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-2">
          {place.description}
        </p>

        {/* Button */}
        <Link
          to={`/places/${place.id}`}
          className="block mt-5 w-full text-center px-4 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default PlaceCard;
