import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTypesStore } from '@/store/useTypes.store';

const BASE_URL = 'https://pokeapi.co/api/v2';

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

export const usePokemons = () =>

  useInfiniteQuery<PokemonListResponse>({
    queryKey: ['pokemons'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await axios.get(`${BASE_URL}/pokemon?offset=${pageParam}&limit=20`);
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get('offset')) || undefined;
    },
  });

export const usePokemonDetail = (name?: string) =>
  useQuery({
    queryKey: ['pokemon', name],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/pokemon/${name}`);
      return data;
    },
    enabled: !!name,
  });

export const usePokemonTypes = () => {
  const { types, setTypes } = useTypesStore();

  return useQuery<string[]>({
    queryKey: ['pokemon-types'],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/type`);
      const typeNames = data.results.map((t: any) => t.name);
      setTypes(typeNames);
      return typeNames;
    },
    initialData: types.length ? types : undefined, 
    staleTime: 1000 * 60 * 60,
  });
};