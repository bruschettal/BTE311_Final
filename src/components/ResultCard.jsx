import { Link } from "react-router";

export default function ResultCard({ item, t }) {
  const isPerson = item.media_type === "person";
  const isMovie = item.media_type === "movie";

  const linkPath = isPerson 
    ? `/person/${item.id}` 
    : isMovie 
      ? `/movie/${item.id}` 
      : `/tv/${item.id}`;

  const imagePath = isPerson ? item.profile_path : item.poster_path;
  const title = isPerson ? item.name : (item.title || item.name);
  const subtitle = isPerson 
      ? item.known_for_department 
      : (item.release_date || item.first_air_date)?.split('-')[0] || 'N/A';

  // Use translation for media type, fallback to capitalized key
  const typeLabel = t?.[item.media_type] || item.media_type?.toUpperCase();

  return (
    <Link to={linkPath}>
      <div className="bg-[#303134] hover:bg-[#3c4043] border border-[#5f6368]/20 hover:border-red-400/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col">
        <div className="relative overflow-hidden aspect-[2/3] w-full bg-[#202124]">
          {imagePath ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${imagePath}`}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#9aa0a6] flex-col gap-2">
              <span className="text-4xl">{isPerson ? '👤' : '?'}</span>
              <span className="text-sm font-medium">{t?.noImage || "No Image"}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white font-medium text-sm">{t?.viewDetails || "View Details"}</span>
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-white font-medium text-lg leading-tight mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-auto pt-4 text-xs font-medium uppercase tracking-wider text-[#9aa0a6]">
             <span>{typeLabel}</span>
             <span>{subtitle}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
