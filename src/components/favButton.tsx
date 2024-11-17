import { Star } from "lucide-react";
import type { WeatherData } from "../api/types"
import { useFavorite } from "../hooks/use-favorite"
import { Button } from "./ui/button";
import { toast } from "sonner";

interface favButtonProps {
  data: WeatherData
}

const FavButton = ({ data }: favButtonProps) => {

  const { addToFav, isFav, removeFav } = useFavorite();
  const isCurentFav = isFav(data.coord.lat,data.coord.lon)

  const handleTogglefav=()=>{
    if(isCurentFav){
      removeFav.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removerd ${data.name} from Favorites`)
    }else{
      addToFav.mutate({
        name:data.name,
        lat:data.coord.lat,
        lon:data.coord.lon,
        country:data.sys.country
      });
      toast.success(`Added ${data.name} to Favorites`)
    }
  }


  return (
  <Button
  variant={isCurentFav ? 'default' : 'outline'}
  size='icon'
  className={isCurentFav ? 'bg-yellow-500 hover:bg-yellow-600':''}
  onClick={handleTogglefav}
  >
    <Star 
    className={`h-4 w-4 ${isCurentFav ? 'fill-current' : ''}`}
    />
  </Button>
  )
}

export default FavButton