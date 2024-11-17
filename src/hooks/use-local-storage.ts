import { useEffect, useState } from "react";



export function useLocalStorage<T>(key:string,initailValue:T){
    const [storeValue,setStoreValue] = useState<T>(()=>{
        try {
            const item = window.localStorage.getItem(key);
            return item?JSON.parse(item) : initailValue
        } catch (error) {
            console.error(error);
            return initailValue;
        }
    });

    useEffect(()=>{
        try {
            window.localStorage.setItem(key,JSON.stringify(storeValue));
        } catch (error) {
            console.error(error);
        }
    },[key,setStoreValue])

    return [storeValue,setStoreValue] as const;
}