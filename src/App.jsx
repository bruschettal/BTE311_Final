import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import TvDetails from "./pages/TvDetails";
import PersonDetails from "./pages/PersonDetails";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#202124] text-[#e8eaed]">
        <div className="flex-grow pb-12">
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TvDetails />} />
            <Route path="/person/:id" element={<PersonDetails />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
