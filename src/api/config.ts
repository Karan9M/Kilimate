export const API_CONFIGS = {
    BASE_URL : "https://api.openweathermap.org/data/2.5",
    GEO : "https://api.openweathermap.org/geo/1.0",
    API_KEY:import.meta.env.VITE_WEATHER_API,
    DEFAULT_PARAMS : {
        units:'metrics',
        appid:import.meta.env.VITE_WEATHER_API,
    },
};