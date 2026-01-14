export default function SearchBar({ query, setQuery, loading, placeholder }) {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10 group">
      <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-center bg-[#303134] rounded-full shadow-lg border border-[#5f6368]/50 hover:border-[#5f6368] transition-colors overflow-hidden">
        <div className="pl-6 text-[#9aa0a6]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full py-4 px-4 bg-transparent text-white outline-none placeholder-[#9aa0a6] text-lg"
        />
        {loading && (
          <div className="pr-6">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400"></div>
          </div>
        )}
      </div>
    </div>
  );
}
