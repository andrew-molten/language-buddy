import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import request from 'superagent'
import { useAuth0 } from '@auth0/auth0-react'
import { NewUser, UpdatedUser } from '../../models/admin'
import { useNavigate } from 'react-router-dom'

const rootUrl = '/api/v1'

export const useGetUser = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  return useQuery({
    enabled: isAuthenticated,
    queryKey: ['user'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      const res = await request
        .get(`${rootUrl}/user`)
        .set('Authorization', `Bearer ${token}`)
      return res.body
    },
  })
}

export const useCreateUser = () => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createUser'],
    mutationFn: async (newUser: NewUser) => {
      const token = await getAccessTokenSilently()
      return await request
        .post(`${rootUrl}/user`)
        .send(newUser)
        .set('Authorization', `Bearer ${token}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export const useUpdateUser = () => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationKey: ['updateUser'],
    mutationFn: async (updatedUser: UpdatedUser) => {
      const token = await getAccessTokenSilently()
      return await request
        .patch(`${rootUrl}/user`)
        .send(updatedUser)
        .set('Authorization', `Bearer ${token}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      navigate('/')
    },
  })
}
