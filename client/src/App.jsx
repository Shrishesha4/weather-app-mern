import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import WeatherCard from "./components/WeatherCard";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import AuthForm from "./components/auth/AuthForm";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || "" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["x-auth-token"] = token;
  return config;
});

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading: authLoading } = useContext(AuthContext);

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    try {
      setFavorites((await api.get("/api/favorites")).data);
    } catch (err) {
      console.error("Failed to fetch favorites");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const clearState = () => {
    setWeatherData(null);
    setError(null);
  };

  const fetchWeather = async (searchCity) => {
    if (!searchCity?.trim()) return setError("Please enter a city name.");
    setLoading(true);
    clearState();
    setShowFavorites(false);
    try {
      const res = await api.get(`/api/weather?city=${searchCity}`);
      setWeatherData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteAction = async () => {
    if (!weatherData) return;
    const isFav = favorites.some((fav) => fav.city === weatherData.name);
    try {
      if (isFav) {
        const favToDelete = favorites.find(
          (fav) => fav.city === weatherData.name
        );
        await api.delete(`/api/favorites/${favToDelete._id}`);
      } else {
        await api.post("/api/favorites", {
          city: weatherData.name,
          country: weatherData.sys.country,
        });
      }
      fetchFavorites();
    } catch (err) {
      alert(err.response?.data?.msg || "Action failed.");
    }
  };

  if (authLoading)
    return (
      <div className="app-container">
        <Loader />
      </div>
    );

  return (
    <>
      <Navbar
        onShowAuth={(mode) => {
          setAuthMode(mode);
          setShowAuth(true);
        }}
        onShowFavorites={() => {
          clearState();
          setShowFavorites(true);
        }}
      />
      {showAuth && (
        <AuthForm
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSwitchMode={() =>
            setAuthMode((m) => (m === "login" ? "register" : "login"))
          }
        />
      )}

      <div className="app-container">
        <h1 className="fade-in">
          {user ? `Hi, ${user.username}` : "Good Day"}
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchWeather(city);
          }}
          className="search-form fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            Search
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {loading && <Loader />}

        {weatherData && (
          <WeatherCard
            data={weatherData}
            onFavoriteAction={handleFavoriteAction}
            isFavorite={favorites.some((fav) => fav.city === weatherData.name)}
          />
        )}

        {showFavorites && user && (
          <div className="favorites-container glass scale-up">
            <h2>My Favorites</h2>
            {favorites.length > 0 ? (
              <ul>
                {favorites.map((fav) => (
                  <li key={fav._id} onClick={() => fetchWeather(fav.city)}>
                    {fav.city}, {fav.country}
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no favorite cities yet.</p>
            )}
          </div>
        )}

        {!weatherData && !loading && !error && !showFavorites && (
          <div
            className="glass fade-in"
            style={{ animationDelay: "0.4s", padding: "2rem 4rem" }}
          >
            <p>Enter a city or log in to see your favorites.</p>
          </div>
        )}
      </div>
    </>
  );
}
export default App;
