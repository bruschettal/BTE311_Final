import { useParams, useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import ResultCard from "../components/ResultCard";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function PersonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchPersonData = async () => {
      setLoading(true);
      try {
        const langParam = language === "tr" ? "tr-TR" : "en-US";
        
        // Fetch Person Details
        const personRes = await fetch(
          `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=${langParam}`
        );
        const personData = await personRes.json();
        setPerson(personData);

        // Fetch Person Credits (Combined Movies & TV)
        const creditsRes = await fetch(
            `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}&language=${langParam}`
        );
        const creditsData = await creditsRes.json();
        
        // Deduplicate credits by ID
        const uniqueCreditsMap = new Map();
        creditsData.cast?.forEach(item => {
            if (!uniqueCreditsMap.has(item.id)) {
                uniqueCreditsMap.set(item.id, item);
            }
        });
        
        // Sort by popularity or date (descending)
        const sortedCredits = Array.from(uniqueCreditsMap.values())
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 20);
            
        setCredits(sortedCredits);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [id, language]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96 text-white">
        {t.loading}
      </div>
    );
  if (!person)
    return (
      <div className="text-white p-8">
        {t.notFound}
      </div>
    );

  return (
    <div className="text-[#e8eaed] p-6 md:p-12 w-full relative">
      {/* Navigation Buttons */}
      <div className="absolute top-8 left-8 flex gap-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="bg-[#303134] hover:bg-[#3c4043] text-white px-4 py-2 rounded-full transition-all border border-[#5f6368]/30 hover:border-red-500/60 hover:text-red-400 flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
        >
          <span>←</span> {t.back}
        </button>
        <Link
            to="/"
            className="bg-[#303134] hover:bg-[#3c4043] text-white px-4 py-2 rounded-full transition-all border border-[#5f6368]/30 hover:border-red-500/60 hover:text-red-400 flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
        >
            <span>🏠</span> Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto pt-20">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Profile Image & Info */}
          <div className="flex-shrink-0 md:w-80 flex flex-col gap-6">
            <div className="w-full aspect-[2/3] bg-[#303134] rounded-2xl overflow-hidden border border-[#5f6368]/30 shadow-2xl">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#9aa0a6] text-6xl">
                    👤
                </div>
              )}
            </div>

            <div className="bg-[#303134] p-6 rounded-2xl border border-[#5f6368]/30 space-y-4">
               {person.known_for_department && (
                  <div>
                    <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider">{t.knownFor}</h3>
                    <p className="text-white text-lg font-medium">{person.known_for_department}</p>
                  </div>
               )}
               {person.gender > 0 && (
                   <div>
                     <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider">{t.gender}</h3>
                     <p className="text-white text-base">{t[`gender${person.gender}`]}</p>
                   </div>
               )}
               {person.birthday && (
                   <div>
                     <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider">{t.birthday}</h3>
                     <p className="text-white text-base">{person.birthday}</p>
                   </div>
               )}
               {person.deathday && (
                   <div>
                     <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider">{t.deathday}</h3>
                     <p className="text-white text-base">{person.deathday}</p>
                   </div>
               )}
               {person.place_of_birth && (
                   <div>
                     <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider">{t.placeOfBirth}</h3>
                     <p className="text-white text-base">{person.place_of_birth}</p>
                   </div>
               )}
               {person.also_known_as && person.also_known_as.length > 0 && (
                   <div>
                     <h3 className="text-[#9aa0a6] font-medium uppercase text-xs tracking-wider">{t.alsoKnownAs}</h3>
                     <ul className="text-white text-sm list-disc pl-4 space-y-1">
                       {person.also_known_as.slice(0, 5).map((alias, idx) => (
                         <li key={idx}>{alias}</li>
                       ))}
                     </ul>
                   </div>
               )}
            </div>
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">{person.name}</h1>
            
            {person.biography && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-white">{t.biography}</h2>
                <p className="text-[#bdc1c6] leading-relaxed whitespace-pre-line">
                  {person.biography}
                </p>
              </div>
            )}

            {credits.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-6 text-white border-b border-[#5f6368]/30 pb-4">
                  {t.knownFor} ({credits.length})
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {credits.map(item => (
                      <ResultCard key={item.id + item.media_type} item={item} t={t} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
