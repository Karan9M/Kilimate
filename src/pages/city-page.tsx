import { useParams, useSearchParams } from "react-router-dom"
import { useForcastQuery, useWeatherQuery } from "../hooks/use-weather";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertTriangle } from "lucide-react";
import WeatherSkeleton from "../components/LoadingSkeleton";
import CurrentWeather from "../components/CurrentWeather";
import HourlyTemp from "../components/hourly-temp";
import WeatherDetails from "../components/WeatherDetails";
import WeatherForcast from "../components/WeatherForcast";
import FavButton from "../components/favButton";


const CityPage = () => {

  const [seachParams] = useSearchParams()
  const params = useParams();
  const lat = parseFloat(seachParams.get('lat') || '0')
  const lon = parseFloat(seachParams.get('lon') || '0')

  const coordinates = {lat,lon}

  const weatherQuery = useWeatherQuery(coordinates)
  const forcastQuery = useForcastQuery(coordinates)

  if(weatherQuery.error || forcastQuery.error){
    return (<Alert variant={"destructive"}>
      <AlertTriangle className="h-4 w-4"/>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Failed to fetch weather data. Please try again!</p>
      </AlertDescription>
    </Alert>
    )
  }

  if(!weatherQuery.data || !forcastQuery.data || !params.cityName){
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Favorite cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{params.cityName},{weatherQuery.data.sys.country}</h1>
        <div>
          <FavButton data={{...weatherQuery.data,name:params.cityName}}/>
        </div>
      </div>

      <div className="grid gap-6">
          <div className="flex flex-col gap-4">
            <CurrentWeather 
            data={weatherQuery.data} 
            />
            <HourlyTemp
            data={forcastQuery.data}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2 items-start">
            <WeatherDetails data={weatherQuery.data}/>
            {/* forcast */}
            <WeatherForcast data={forcastQuery.data}/>
          </div>
      </div>
    </div>
  )
}

export default CityPage