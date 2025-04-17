import type { UmiData } from '@/types/umi-data';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const umiApi = createApi({
  reducerPath: 'umiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    getData: builder.query<UmiData, string>({
      query: (path) => `${path}.json`,
    }),
  }),
});

export const { useGetDataQuery } = umiApi;
