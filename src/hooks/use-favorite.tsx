import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface FavoriteCity {
    id: string,
    lat: number,
    lon: number,
    name: string,
    country: string,
    state?: string,
    addedAt: number,
}

export function useFavorite() {
    const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>("fav", []);

    const queryClient = useQueryClient();

    const favQuery = useQuery({
        queryKey: ['fav'],
        queryFn: () => favorites,
        initialData: favorites,
        staleTime:Infinity,
    })

    const addToFav = useMutation({
        mutationFn: async (
            city: Omit<FavoriteCity, "id" | "addedAt">
        ) => {
            const newFav: FavoriteCity = {
                ...city,
                id: `${city.lat}-${city.lon}`,
                addedAt: Date.now(),
            };

            const exists = favorites.some((fav)=>fav.id === newFav.id);
            if(exists) return favorites


            const newFavs= [...favorites, newFav].slice(0, 10);

            setFavorites(newFavs)
            return newFavs;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:['fav'],
            });
        }
    });

    const removeFav = useMutation({
        mutationFn: async (cityId:string) => {
           const newFavs = favorites.filter((city)=>city.id !== cityId)
           setFavorites(newFavs)

           return newFavs
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:['fav'],
            });
        }
    })

    return {
        favorites:favQuery.data,
        addToFav,
        removeFav,
        isFav:(lat:number,lon:number)=>
            favorites.some((city)=> city.lat === lat && city.lon === lon)
    }
}