
import { useState } from "react"
import { Button } from "./ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"
import { Clock, Loader2, Search, SearchIcon, Star, XCircle } from "lucide-react"
import { UseSerchLocations } from "../hooks/use-weather"
import { useNavigate } from "react-router-dom"
import { useSeachHistory } from "../hooks/use-search-history"
import { format } from "date-fns"
import { useFavorite } from "../hooks/use-favorite"


const CitySeach = () => {

    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const { data: loactions, isLoading } = UseSerchLocations(query)
    const navigate = useNavigate()
    const { history, clearHistory, addToHistory } = useSeachHistory();

    const handleSelect = (cityData: string) => {
        const [lat, lon, name, country] = cityData.split("|")

        //Add to seach history
        addToHistory.mutate({
            query,
            name,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            country,
        })

        setOpen(false)
        navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
    }

    const {favorites}  = useFavorite()

    return (
        <>
            <Button
                variant="outline"
                className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setOpen(true)}>
                <Search className="mr-2 h-4 w-4" />
                Seach cities...
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Seach cities..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {query.length > 2 && !isLoading && (<CommandEmpty>No cities found.</CommandEmpty>)}

                    {favorites.length > 0 && (
                            <CommandGroup heading='Favorites'>
                                {history.map((loc) => {
                                    return (<CommandItem key={loc.id}
                                        value={`${loc.lat}|${loc.lon}|${loc.name}|${loc.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                                        <span>{loc.name}</span>
                                        {loc.state && (
                                            <span className="text-sm text-muted-foreground">
                                                , {loc.state}
                                            </span>
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                            , {loc.country}
                                        </span>
                                    </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                    )}


                    {history.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup>
                                <div className="flex items-center justify-between px-2 my-2">
                                    <p className="text-xs text-muted-foreground">Recent Seaches</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => clearHistory.mutate()}
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Clear
                                    </Button>
                                </div>

                                {history.map((loc) => {
                                    return (<CommandItem key={`${loc.lat}-${loc.lon}`}
                                        value={`${loc.lat}|${loc.lon}|${loc.name}|${loc.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span>{loc.name}</span>
                                        {loc.state && (
                                            <span className="text-sm text-muted-foreground">
                                                , {loc.state}
                                            </span>
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                            , {loc.country}
                                        </span>
                                        <span className="ml-auto text-xs text-muted-foreground">
                                           {format(loc.seachedAt,'MMM d, h:mm a ')}
                                        </span>
                                    </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </>
                    )}
                    <CommandSeparator />

                    {loactions && loactions.length > 0 && (
                        <CommandGroup heading="Suggestions">
                            {isLoading && (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            )}
                            {loactions.map((loc) => {
                                return (
                                    <CommandItem key={`${loc.lat}-${loc.lon}`}
                                        value={`${loc.lat}|${loc.lon}|${loc.name}|${loc.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <SearchIcon className="mr-2 h-4 w-4" />
                                        <span>{loc.name}</span>
                                        {loc.state && (
                                            <span className="text-sm text-muted-foreground">
                                                , {loc.state}
                                            </span>
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                            , {loc.country}
                                        </span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    )}

                </CommandList>
            </CommandDialog>
        </>
    )
}

export default CitySeach