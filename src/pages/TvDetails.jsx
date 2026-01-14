import { useParams, useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function TvDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tv, setTv] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchTv = async () => {
      setLoading(true);
      try {
        const langParam = language === "tr" ? "tr-TR" : "en-US";
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=${langParam}&append_to_response=credits`
        );
        const data = await res.json();
        setTv(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTv();
  }, [id, language]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96 text-white">
        {t.loading}
      </div>
    );
  if (!tv) return <div className="text-white p-8">{t.notFound}</div>;

  return (
    <div className="text-[#e8eaed] w-full">
      {/* Hero Banner (Arka Plan Resmi) */}
      <div className="relative h-[65vh] w-full bg-[#202124]">
        {tv.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            className="w-full h-full object-cover opacity-50"
            alt=""
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#202124] via-[#202124]/40 to-transparent" />

        {/* Navigation Buttons */}
        <div className="absolute top-8 left-8 flex gap-4 z-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#303134] hover:bg-[#3c4043] text-white px-4 py-2 rounded-full transition-all border border-[#5f6368]/30 hover:border-red-500/60 hover:text-red-400 cursor-pointer flex items-center gap-2 shadow-lg active:scale-95"
          >
            <span>←</span> {t.back}
          </button>
          <Link
            to="/"
            className="bg-[#303134] hover:bg-[#3c4043] text-white px-4 py-2 rounded-full transition-all border border-[#5f6368]/30 hover:border-red-500/60 hover:text-red-400 cursor-pointer flex items-center gap-2 shadow-lg active:scale-95"
          >
            <span>🏠</span> Home
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Poster & Sidebar */}
          <div className="flex-shrink-0 md:w-64 flex flex-col gap-6">
            <div className="w-full aspect-[2/3] bg-[#303134] rounded-2xl overflow-hidden border border-[#5f6368]/30 shadow-2xl">
              {tv.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                  alt={tv.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#9aa0a6] text-sm">
                  {t.noImage}
                </div>
              )}
            </div>

            {/* Sidebar Stats */}
            <div className="bg-[#303134] p-6 rounded-2xl border border-[#5f6368]/30 space-y-4">
              <div>
                <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider">
                  {t.status}
                </h3>
                <p className="text-white text-base">{tv.status}</p>
              </div>
              <div>
                <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider">
                  {t.originalLanguage}
                </h3>
                <p className="text-white text-base uppercase">
                  {tv.original_language}
                </p>
              </div>
              {tv.number_of_episodes > 0 && (
                <div>
                  <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider">
                    {t.numberOfEpisodes}
                  </h3>
                  <p className="text-white text-base">
                    {tv.number_of_episodes}
                  </p>
                </div>
              )}
              {tv.last_air_date && (
                <div>
                  <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider">
                    {t.lastAirDate}
                  </h3>
                  <p className="text-white text-base">{tv.last_air_date}</p>
                </div>
              )}
              {tv.created_by?.length > 0 && (
                <div>
                  <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider mb-2">
                    {t.createdBy}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tv.created_by.map((creator) => (
                      <span
                        key={creator.id}
                        className="text-sm text-white block"
                      >
                        {creator.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tv.production_companies?.length > 0 && (
                <div>
                  <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider mb-2">
                    {t.productionCompanies}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tv.production_companies.map((company) => (
                      <span
                        key={company.id}
                        className="text-xs bg-[#202124] px-2 py-1 rounded border border-[#5f6368]/30 text-white"
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
              {tv.name}
            </h1>
            {tv.tagline && (
              <p className="italic text-[#9aa0a6] mb-4 text-lg">
                "{tv.tagline}"
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              {tv.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="text-xs font-medium px-2.5 py-0.5 rounded bg-white/10 text-white border border-white/10"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-8 text-sm">
              <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1">
                ⭐ {tv.vote_average?.toFixed(1)}{" "}
                <span className="text-[#9aa0a6] text-xs">
                  ({tv.vote_count?.toLocaleString()})
                </span>
              </span>
              {tv.episode_run_time?.[0] > 0 && (
                <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/30">
                  ⏱ {tv.episode_run_time[0]} {t.episodeRuntime}
                </span>
              )}
              {tv.number_of_seasons > 0 && (
                <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">
                  📺 {tv.number_of_seasons} {t.seasons}
                </span>
              )}
              {tv.first_air_date && (
                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  📅 {tv.first_air_date}
                </span>
              )}
            </div>

            {tv.overview && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-white border-b border-[#5f6368]/30 pb-2">
                  {t.overview}
                </h2>
                <p className="text-[#bdc1c6] leading-relaxed text-lg">
                  {tv.overview}
                </p>
              </div>
            )}

            {/* Cast */}
            {tv.credits?.cast?.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  {t.cast}
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                  {tv.credits.cast.slice(0, 12).map((person) => (
                    <Link
                      key={person.id}
                      to={`/person/${person.id}`}
                      className="text-center group"
                    >
                      <div className="aspect-square w-full rounded-full overflow-hidden mb-2 border-2 border-[#5f6368]/30 group-hover:border-red-400 transition-colors">
                        <img
                          src={
                            person.profile_path
                              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                              : "https://placehold.co/185x278?text=N/A"
                          }
                          className="w-full h-full object-cover"
                          alt={person.name}
                        />
                      </div>
                      <p className="text-xs font-semibold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                        {person.name}
                      </p>
                      <p className="text-[10px] text-[#9aa0a6] line-clamp-1">
                        {person.character}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Seasons */}
            {tv.seasons?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white border-b border-[#5f6368]/30 pb-2">
                  {t.seasons}
                </h2>

                {/* Conditionally render Grid or List based on season count */}
                {tv.seasons.length > 5 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {tv.seasons.map((season) => (
                      <div
                        key={season.id}
                        className="bg-[#303134] border border-[#5f6368]/30 rounded-xl overflow-hidden group hover:border-red-400 transition-colors h-full flex flex-col"
                      >
                        <div className="aspect-[2/3] bg-[#202124] relative overflow-hidden">
                          {season.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                              alt={season.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#9aa0a6] text-xs">
                              {t.noImage}
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex flex-col flex-grow">
                          <h3 className="text-white font-medium truncate text-sm mb-1 group-hover:text-red-400 transition-colors">
                            {season.name}
                          </h3>
                          <div className="mt-auto">
                            <p className="text-xs text-[#9aa0a6] flex items-center justify-between">
                              <span>{season.episode_count} Eps</span>
                              <span>{season.air_date?.split("-")[0]}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tv.seasons.map((season) => (
                      <div
                        key={season.id}
                        className="flex gap-4 bg-[#303134] border border-[#5f6368]/30 rounded-xl overflow-hidden p-4 group hover:border-red-400/50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-24 md:w-32 aspect-[2/3] bg-[#202124] rounded-lg overflow-hidden">
                          {season.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                              alt={season.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#9aa0a6] text-xs">
                              {t.noImage}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                            {season.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-[#9aa0a6] mb-2">
                            <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/30 text-xs">
                              {season.episode_count} {t.numberOfEpisodes}
                            </span>
                            {season.air_date && (
                              <span>{season.air_date.split("-")[0]}</span>
                            )}
                          </div>
                          {season.overview && (
                            <p className="text-sm text-[#bdc1c6] line-clamp-2 md:line-clamp-3">
                              {season.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
