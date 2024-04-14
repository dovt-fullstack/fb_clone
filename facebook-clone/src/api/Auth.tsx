import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store/store'
import { refreshUser } from '../store/slices/Auth.slice'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).persistedReducer.auth.user?.accessToken

    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`)
      // headers: {
      //   "Access-control-Allow-Origin": origin || "*",
      //   "Content-type": "text/plain",
      // },
    }
    return headers
  }
})

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args: any,
  api: any,
  extraOptions : any
) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.meta?.response?.status === 403) {
    // try to get a new token
    const refreshToken = await baseQuery('/api/refreshToken', api, extraOptions) // Request refreshToken
    if (refreshToken.data) {
      // store the new token
      const { user } = (api.getState() as RootState).persistedReducer.auth
      api.dispatch(refreshUser({ ...refreshToken.data, user })) // Cấp lại AccessToken
    }
  }
  return result
}

export const Auth = createApi({
  reducerPath: 'Auth',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<void, any>({
      query: ({ ...rest }) => ({
        url: '/api/register',
        body: rest,
        method: 'POST',
        credentials: 'include'
      })
    }),
    login: builder.mutation<any, any>({
      query: ({ ...rest }) => ({
        url: '/api/login',
        body: rest,
        method: 'POST',
        credentials: 'include'
      })
    }),
    logout: builder.mutation<unknown, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credential: 'include'
      })
    }),
    fetchUser: builder.query<any, void>({
      query: () => ({
        url: '/auth/getUser',
        credentials: 'include'
      })
    }),
    updateInfor: builder.mutation<void, any>({
      query: ({ _id, ...rest }) => ({
        url: `/api/updateInfor/${_id}`,
        method: 'PATCH',
        body: rest,
        credentials: 'include'
      })
    }),
    forgotPassword: builder.mutation({
      query: (data: { email: string }) => ({
        url: '/api/forgot-password',
        method: 'POST',
        body: data,
        credentials: 'include'
      })
    }),
    resetForgotPassword: builder.mutation({
      query: (data: { password: string; token: string }) => ({
        url: `/api/reset-password/${data.token}`,
        method: 'PUT',
        body: data,
        credentials: 'include'
      })
    })
  })
})

export const {
  useRegisterMutation,
  useResetForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useFetchUserQuery,
  useUpdateInforMutation,
  useForgotPasswordMutation
} = Auth
