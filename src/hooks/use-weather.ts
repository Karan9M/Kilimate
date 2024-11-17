import { useQuery } from "@tanstack/react-query";
import { Coordinates } from "../api/types";
import {weatherAPI} from "../api/weather"


export const WEATHER_KEYS={
    weather: (coords:Coordinates)=>['weather',coords] as const,
    forcast: (coords:Coordinates)=>['forcast',coords] as const,
    loaction: (coords:Coordinates)=>['location',coords] as const,
    search: (query:string)=>['location-search',query] as const,
} as const;


export function useWeatherQuery(coordinates:Coordinates | null){
    return useQuery({
        queryKey: WEATHER_KEYS.weather(coordinates ?? {lat:0,lon:0}),
        queryFn:()=>coordinates?weatherAPI.getCurrentWeather(coordinates):null,
        enabled:!!coordinates,
    });
}

export function useForcastQuery(coordinates:Coordinates | null){
    return useQuery({
        queryKey: WEATHER_KEYS.forcast(coordinates ?? {lat:0,lon:0}),
        queryFn:()=>coordinates?weatherAPI.getForCast(coordinates):null,
        enabled:!!coordinates,
    });
}

export function useRevGeoQuery(coordinates:Coordinates | null){
    return useQuery({
        queryKey: WEATHER_KEYS.loaction(coordinates ?? {lat:0,lon:0}),
        queryFn:()=>coordinates?weatherAPI.revGeoCode(coordinates):null,
        enabled:!!coordinates,
    });
}

export function UseSerchLocations(query:string){
    return useQuery({
        queryKey:WEATHER_KEYS.search(query),
        queryFn:()=>
             weatherAPI.serchLocations(query),
        enabled: query.length >= 3,
    })
}