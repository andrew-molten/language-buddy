import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import request from 'superagent'

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
