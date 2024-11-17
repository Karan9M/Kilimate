import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface SearchHistoryItem {
    id: string,
    query: string,
    lat: number,
    lon: number,
    name: string,
    country: string,
    state?: string,
    seachedAt: number,
}

export function useSeachHistory() {
    const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>("seach-history", []);

    const queryClient = useQueryClient();

    const historyQuery = useQuery({
        queryKey: ['seach-history'],
        queryFn: () => history,
        initialData: history
    })

    const addToHistory = useMutation({
        mutationFn: async (
            seach: Omit<SearchHistoryItem, "id" | "seachedAt">
        ) => {
            const newSeach: SearchHistoryItem = {
                ...seach,
                id: `${seach.lat}-${seach.lon}-${Date.now()}`,
                seachedAt: Date.now(),
            };

            const filteredHistory = history.filter(
                (item) => !(item.lat === seach.lat && item.lon === seach.lon)
            );
            const newHistory = [newSeach, ...filteredHistory].slice(0, 10);

            setHistory(newHistory)
            return newHistory;
        },
        onSuccess: (newHistory) => {
            queryClient.setQueryData(['seach-history'], newHistory)
        }
    });

    const clearHistory = useMutation({
        mutationFn: async () => {
            setHistory([])
            return [];
        },
        onSuccess: () => {
            queryClient.setQueryData(['seach-history'], [])
        }
    })

    return {
        history: historyQuery.data ?? [],
        addToHistory,
        clearHistory
    }
}