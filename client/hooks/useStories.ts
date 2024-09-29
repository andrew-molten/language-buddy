import { useMutation, useQuery } from '@tanstack/react-query'
import request from 'superagent'
import type { Stories } from '../../models/stories'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { JournalEntryCheck } from '../../models/journal'

const rootUrl = '/api/v1'

export const useChatGPT = () => {
  const { getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['compareStories'],
    mutationFn: async ({
      nativeStory,
      learningLanguageStory,
      nativeLanguage,
      learningLanguage,
    }: Stories) => {
      const token = await getAccessTokenSilently()
      const res = await request
        .post(`${rootUrl}/check-story`)
        .send({
          nativeStory,
          learningLanguageStory,
          nativeLanguage,
          learningLanguage,
        })
        .set('Authorization', `Bearer ${token}`)

      // console.log('useMutatation: ', res.body)
      navigate('/story-differences', { state: { response: res.body } })
      // return res.body
    },
    onSuccess: () => {},
  })
}

export const useStoryHistory = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  return useQuery({
    enabled: isAuthenticated,
    queryKey: ['storyHistory'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      const res = await request
        .get(`${rootUrl}/story-history`)
        .set('Authorization', `Bearer ${token}`)
      return res.body
    },
  })
}

export const useVocabulary = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useQuery({
    enabled: isAuthenticated,
    queryKey: ['vocabulary'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      const res = await request
        .get(`${rootUrl}/vocabulary`)
        .set('Authorization', `Bearer ${token}`)

      return res.body
    },
  })
}

export const useCheckJournalEntry = () => {
  const { getAccessTokenSilently } = useAuth0()
  // const navigate = useNavigate()

  return useMutation({
    mutationKey: ['checkJournalEntry'],
    mutationFn: async ({
      journalEntry,
      nativeLanguage,
      learningLanguage,
    }: JournalEntryCheck) => {
      const token = await getAccessTokenSilently()
      const res = await request
        .post(`${rootUrl}/check-journal-entry`)
        .send({
          journalEntry,
          nativeLanguage,
          learningLanguage,
        })
        .set('Authorization', `Bearer ${token}`)

      console.log('useCheckJournalEntry: ', res.body)
      // navigate('/story-differences', { state: { response: res.body } })
      // return res.body
    },
    onSuccess: () => {},
  })
}
