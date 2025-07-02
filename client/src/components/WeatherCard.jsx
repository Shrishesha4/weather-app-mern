import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './WeatherCard.css';
const WeatherCard = ({ data, onFavoriteAction, isFavorite }) => {
    const { user } = useContext(AuthContext);
    if (!data) return null;
    const { name, sys, main, weather } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    return (
        <div className="weather-card glass scale-up">
            <div className="card-header">
                <div><h2 className="city-name">{name}, {sys.country}</h2><p className="weather-description">{weather[0].description}</p></div>
                <div className="header-actions">
                    {user && (<button onClick={onFavoriteAction} className="favorite-button" title={isFavorite ? "Remove from favorites" : "Add to favorites"}>{isFavorite ? '❤️' : '♡'}</button>)}
                    <img src={iconUrl} alt={weather[0].description} className="weather-icon" />
                </div>
            </div>
            <div className="card-body">
                <div className="temperature-container"><p className="temperature">{Math.round(main.temp)}</p><span className="degree-symbol">°C</span></div>
                <div className="weather-details">
                    <div className="detail-item"><span className="label">Feels Like</span><span className="value">{Math.round(main.feels_like)}°C</span></div>
                    <div className="detail-item"><span className="label">Humidity</span><span className="value">{main.humidity}%</span></div>
                </div>
            </div>
        </div>
    );
};
export default WeatherCard;
