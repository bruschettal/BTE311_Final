// src/pages/Search.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import ResultCard from "../components/ResultCard";
import SearchBar from "../components/SearchBar";
import { useLanguage } from "../context/LanguageContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  
  const { language, toggleLanguage, t } = useLanguage();

  // Fetch Popular Content on Mount
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const langParam = language === 'tr' ? 'tr-TR' : 'en-US';
        
        const [moviesRes, tvRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${langParam}&page=1`),
          fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=${langParam}&page=1`)
        ]);

        const moviesData = await moviesRes.json();
        const tvData = await tvRes.json();

        setPopularMovies(moviesData.results || []);
        setPopularTv(tvData.results || []);
      } catch (err) {
        console.error("Error fetching popular content:", err);
      } finally {
        setLoadingPopular(false);
      }
    };

    fetchPopular();
  }, [language]);

  // Handle Search
  useEffect(() => {
    // If query is empty, we are not searching, so loading is false (displaying popular)
    if (!query.trim()) {
        setLoading(false);
        setResults([]);
        setSearchParams({});
        return;
    }

    // Immediately set loading to true when user types to avoid "No results" flash
    setLoading(true);

    const delayDebounceFn = setTimeout(() => {
        setSearchParams({ q: query });
        fetchResults(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, language]); 

  const fetchResults = async (searchQuery) => {
    if (!searchQuery) return;
    // Loading is already true from the effect
    try {
      const langParam = language === 'tr' ? 'tr-TR' : 'en-US';
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=${langParam}&query=${encodeURIComponent(
          searchQuery
        )}&page=1&include_adult=false`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-[#e8eaed] p-6 md:p-12 relative w-full">
        {/* Language Switcher */}
        <div className="fixed top-6 right-6 z-[9999]">
            <button 
                onClick={toggleLanguage}
                className="cursor-pointer flex items-center gap-2 bg-[#303134] hover:bg-[#3c4043] border border-[#5f6368]/50 hover:border-red-500/60 px-4 py-2 rounded-full text-sm font-medium transition-all text-white hover:text-red-400 shadow-lg active:scale-95 group"
            >
                <span>{language === 'tr' ? '🇹🇷 Türkçe' : '🇺🇸 English'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#9aa0a6] group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center text-white tracking-tight mt-10">
          {t.findFavorite} <span className="text-red-400">{t.favoriteHighlight}</span>.
        </h1>

        <SearchBar 
            query={query} 
            setQuery={setQuery} 
            loading={loading} 
            placeholder={t.searchPlaceholder} 
        />

        {/* Search Results */}
        {query ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {results.length > 0 ? (
                results.map((item) => <ResultCard key={item.id} item={item} t={t} />)
            ) : !loading ? (
                <div className="col-span-full text-center mt-12">
                <p className="text-xl text-[#9aa0a6]">{t.noResults} "{query}"</p>
                </div>
            ) : null}
            </div>
        ) : (
            /* Popular Content (Shown when no query) */
            <div className="w-full mt-12 space-y-12">
                
                {/* Popular Movies */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">
                        {language === 'tr' ? 'Popüler Filmler' : 'Popular Movies'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {popularMovies.slice(0, 8).map((item) => (
                            <ResultCard key={item.id} item={{...item, media_type: 'movie'}} t={t} />
                        ))}
                    </div>
                </section>

                {/* Popular TV Shows */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">
                        {language === 'tr' ? 'Popüler Diziler' : 'Popular TV Shows'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {popularTv.slice(0, 8).map((item) => (
                            <ResultCard key={item.id} item={{...item, media_type: 'tv'}} t={t} />
                        ))}
                    </div>
                </section>
            </div>
        )}
      </div>
    </div>
  );
}
