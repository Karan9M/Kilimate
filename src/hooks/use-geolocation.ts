import { useEffect, useState } from "react";
import type { Coordinates } from "../api/types";

interface GeoLocationState {
    coordinates:Coordinates | null;
    error: string | null;
    isLoading : boolean;
}  

export function useGeoLocation(){
    const [locationData,setLocationData] = useState<GeoLocationState>({
        coordinates:null,
        error:null,
        isLoading:true
    });

    const getLocation = ()=>{
        setLocationData((prev)=>({...prev,isLoading:true,error:null}));

        if(!navigator.geolocation){
            setLocationData({
                coordinates:null,
                error:'GeoLocation is not supported by your browser',
                isLoading:false,
            });
            return;
        }
        navigator.geolocation.getCurrentPosition((pos)=>{
            setLocationData({
                coordinates:{
                    lat:pos.coords.latitude,
                    lon:pos.coords.longitude,
                },
                error:null,
                isLoading:false,
            })
        },
        (error) => {
            let errorMessage :string;

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'You have denied the request for your location';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Your location is not available at the moment';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request time out';
                    break;
                default:
                    errorMessage = 'An error occurred while retrieving your location';
            }

            setLocationData({
                coordinates:null,
                error:errorMessage,
                isLoading:false,
            });
        },{
            enableHighAccuracy:true,
            timeout:5000,
            maximumAge:0
        }
    );
 }
    

    useEffect(()=>{
        getLocation();
    },[])

    return{
        ...locationData,
        getLocation
    }
}