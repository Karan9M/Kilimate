import { API_CONFIGS } from "./config"
import { Coordinates, ForecastData, GeocodingResponse, WeatherData } from "./types"

class WeatherAPI {
    private createUrl(endpoint: string, params: Record<string, string | number>) {

        const searchParams = new URLSearchParams({
            appid: API_CONFIGS.API_KEY,
            ...params,
        })
        return `${endpoint}?${searchParams.toString()}`
    }
    private async fetchData<T>(url:string):Promise<T> {
        const response = await fetch(url)
        if(!response.ok){
            throw new Error(`Weather API Error: ${response.statusText}`)
        }
        return response.json();
    }   
    async getCurrentWeather({lat,lon}:Coordinates):Promise<WeatherData> {
        const url = this.createUrl(`${API_CONFIGS.BASE_URL}/weather`,{
            lat:lat.toString(),
            lon:lon.toString(),
            units:API_CONFIGS.DEFAULT_PARAMS.units
        })
        return this.fetchData<WeatherData>(url);
    }


    async getForCast({lat,lon}:Coordinates):Promise<ForecastData> {
        const url = this.createUrl(`${API_CONFIGS.BASE_URL}/forecast`,{
            lat:lat.toString(),
            lon:lon.toString(),
            units:API_CONFIGS.DEFAULT_PARAMS.units
        })
        return this.fetchData<ForecastData>(url);
    }

    async revGeoCode({lat,lon}:Coordinates):Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIGS.GEO}/reverse`,{
            lat:lat.toString(),
            lon:lon.toString(),
            units:API_CONFIGS.DEFAULT_PARAMS.units,
            limit:1,
        })
        return this.fetchData<GeocodingResponse[]>(url);
    }

    async serchLocations(query:string):Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIGS.GEO}/direct`,{
            limit:5,
            q:query,
        })
        return this.fetchData<GeocodingResponse[]>(url);
    }

}

export const weatherAPI = new WeatherAPI();