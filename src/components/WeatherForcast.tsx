import { format } from "date-fns"
import type { ForecastData } from "../api/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ArrowDown, ArrowUp, Droplet, Wind } from "lucide-react"

interface WeatherForcastProps {
    data: ForecastData
}

interface DailyForcast {
    date: number,
    temp_min: number,
    temp_max: number,
    humidity: number,
    wind: number,
    weather: {
        description: string,
        icon: string,
        id: number,
        main: string
    }
}

const WeatherForcast = ({ data }: WeatherForcastProps) => {

    const dailyForcasts = data.list.reduce((acc, forcast) => {
        const date = format(new Date(forcast.dt * 1000), 'yyyy-MM-dd');


        if (!acc[date]) {
            acc[date] = {
                temp_min: forcast.main.temp_min,
                temp_max: forcast.main.temp_max,
                humidity: forcast.main.humidity,
                wind: forcast.wind.speed,
                weather: forcast.weather[0],
                date: forcast.dt,
            };
        } else {
            acc[date].temp_min = Math.min(acc[date].temp_min, forcast.main.temp_min)
            acc[date].temp_max = Math.min(acc[date].temp_max, forcast.main.temp_max)
        }

        return acc;
    }, {} as Record<string, DailyForcast>)

    const nextDays = Object.values(dailyForcasts).slice(0, 6)

    const formatTemp = (temp: number) => `${Math.round(temp - 273.15)}°`

    return (
        <Card>
            <CardHeader>
                <CardTitle>5-Day Forcast</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {nextDays.map((day) => {
                        return <div key={day.date}
                            className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4"
                        >
                            <div>
                                <p className="font-medium">{format(new Date(day.date * 1000), 'EEE , MMM d')}</p>
                                <p className="text-sm text-muted-foreground capitalize">{day.weather.description}</p>
                            </div>
                            <div className="flex justify-center items-center flex-col gap-5 ml-[68px] lg:flex-row lg:gap-10 lg:ml-[100px]">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center text-blue-500">
                                        <ArrowDown className="mr-1 h-4 w-4" />
                                        {formatTemp(day.temp_min)}
                                    </span>
                                    <span className="flex items-center text-red-500">
                                        <ArrowUp className="mr-1 h-4 w-4" />
                                        {formatTemp(day.temp_max)}
                                    </span>
                                </div>
                                <div className="flex justify-end gap-4">
                                    <span className="flex items-center  gap-1">
                                        <Droplet className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">{day.humidity}%</span>
                                    </span>
                                    <span className="flex items-center  gap-1">
                                        <Wind className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">{day.wind}m/s</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </CardContent>
        </Card>

    )
}

export default WeatherForcast