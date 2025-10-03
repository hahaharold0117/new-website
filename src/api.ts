import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { API_URL } from "./lib/env";
import { RootState } from "./store";
import { MainSettingData } from './types'

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/`,
  prepareHeaders: (headers: Headers, { getState }) => {
    const token = (getState() as RootState).auth?.access_token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithToast: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithToast,
  tagTypes: [
    "main_setting",
  ],
  endpoints: (build) => ({
    readMainSettingData: build.query<MainSettingData, { domain: string }>({
      query: ({ domain }) => ({
        url: "public/main-data",
        params: { domain },
      }),
      providesTags: ["main_setting"],
    }),
    // readProject: build.query<Project, string>({
    //   query: (id) => `projects/${id}`,
    //   providesTags: ["main_setting"],
    // }),
    // updateProject: build.mutation<void, { id: string; body: CreateProject }>({
    //   query: ({ id, body }) => ({
    //     url: `projects/${id}`,
    //     method: "put",
    //     body,
    //   }),
    //   invalidatesTags: ["main_setting"],
    // }),
    // deleteProject: build.mutation<void, string>({
    //   query: (id) => ({
    //     url: `projects/${id}`,
    //     method: "delete",
    //   }),
    //   invalidatesTags: ["main_setting"],
    // }),
  }),
});

export const {
  useReadMainSettingDataQuery,
  // useReadProjectQuery,
  // useDeleteProjectMutation,
  // useUpdateProjectMutation,
} = api;
