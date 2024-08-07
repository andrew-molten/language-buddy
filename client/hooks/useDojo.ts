import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import request from 'superagent'
import { PhraseToUpdate } from '../../models/dojo'

const rootUrl = '/api/v1'

export const useDojoPhrases = (
  languageLearning: string,
  languageNative: string,
) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  return useQuery({
    enabled: isAuthenticated,
    queryKey: ['dojoPhrases'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      const res = await request
        .get(`${rootUrl}/dojo/${languageLearning}/${languageNative}`)
        .set('Authorization', `Bearer ${token}`)

      return res.body
    },
  })
}

export const useUpdatePhrases = () => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['updateDojoPhrases'],
    mutationFn: async (phrasesToUpdate: PhraseToUpdate[]) => {
      const token = await getAccessTokenSilently()
      const res = await request
        .patch(`${rootUrl}/dojo`)
        .send(phrasesToUpdate)
        .set('Authorization', `Bearer ${token}`)
      return res.status
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}
