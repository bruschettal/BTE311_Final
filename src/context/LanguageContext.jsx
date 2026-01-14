import { createContext, useState, useContext, useEffect } from "react";

export const translations = {
  en: {
    searchPlaceholder: "Search movies or TV shows...",
    noResults: "No results found for",
    startTyping: "Type something to start searching...",
    findFavorite: "Find your next",
    favoriteHighlight: "favorite",
    viewDetails: "View Details",
    loading: "Loading...",
    back: "Go Back",
    overview: "Overview",
    cast: "Top Cast",
    notFound: "Content not found.",
    seasons: "Seasons",
    episodeRuntime: "min/ep",
    noImage: "No Image",
    vote: "Vote",
    releaseDate: "Release Date",
    biography: "Biography",
    placeOfBirth: "Place of Birth",
    birthday: "Birthday",
    knownFor: "Known For",
    acting: "Acting",
    deathday: "Date of Death",
    gender: "Gender",
    alsoKnownAs: "Also Known As",
    gender1: "Female",
    gender2: "Male",
    gender3: "Non-binary",
    gender0: "Not Specified",
    genres: "Genres",
    status: "Status",
    originalLanguage: "Original Language",
    budget: "Budget",
    revenue: "Revenue",
    productionCompanies: "Production Companies",
    createdBy: "Created By",
    numberOfEpisodes: "Episodes",
    lastAirDate: "Last Air Date",
    movie: "Movie",
    tv: "TV Show",
    person: "Person",
  },
  tr: {
    searchPlaceholder: "Film veya dizi ara...",
    noResults: "Sonuç bulunamadı:",
    startTyping: "Arama yapmak için yazmaya başlayın...",
    findFavorite: "Sıradaki",
    favoriteHighlight: "favorini bul",
    viewDetails: "Detayları Gör",
    loading: "Yükleniyor...",
    back: "Geri Dön",
    overview: "Özet",
    cast: "Oyuncular",
    notFound: "İçerik bulunamadı.",
    seasons: "Sezon",
    episodeRuntime: "dk/bölüm",
    noImage: "Resim Yok",
    vote: "Puan",
    releaseDate: "Yayın Tarihi",
    biography: "Biyografi",
    placeOfBirth: "Doğum Yeri",
    birthday: "Doğum Tarihi",
    knownFor: "Rol Aldığı Yapımlar",
    acting: "Oyunculuk",
    deathday: "Ölüm Tarihi",
    gender: "Cinsiyet",
    alsoKnownAs: "Diğer İsimleri",
    gender1: "Kadın",
    gender2: "Erkek",
    gender3: "Non-binary",
    gender0: "Belirtilmemiş",
    genres: "Türler",
    status: "Durum",
    originalLanguage: "Orijinal Dil",
    budget: "Bütçe",
    revenue: "Hasılat",
    productionCompanies: "Yapım Şirketleri",
    createdBy: "Yapımcı",
    numberOfEpisodes: "Bölüm Sayısı",
    lastAirDate: "Son Yayın Tarihi",
    movie: "Film",
    tv: "Dizi",
    person: "Kişi",
  },
};

// Create context with default values to avoid runtime crashes
const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("appLanguage") || "en";
  });

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "tr" : "en"));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
