import { useQuery } from '@tanstack/react-query'
// import request from 'superagent'
import { API_KEY } from '../env'
import superagent from 'superagent'

const gpt35 = 'gpt-3.5-turbo-0613'
// const gpt4 = 'gpt-4o'

const fetchChatGPTResponse = async (
  englishStory: string,
  germanStory: string,
) => {
  const response = await superagent
    .post('https://api.openai.com/v1/chat/completions')
    .set('Authorization', `Bearer ${API_KEY}`)
    .send({
      model: gpt35,
      messages: [
        {
          role: 'user',
          content: `
      I am going to give you 2 stories, one in English, and one in German, I'm not very good at speaking german so please can you tell me what I could improve in my German story so that it translates to the english story.

      Don't include any new line notation, the response MUST be JSON formatted like this so that it is easy to parse: '{translatedGermanStory: "string", corrections: Correction[], wordsToAddToVocabulary: NewWord[]}'
      
      interface Correction {
      original: "string",
      correction: "string"
      }

      interface NewWord {
      word: "string",
      meaning: "string",
      }
      
      English story:     
      ${englishStory}
      
      German story: ${germanStory}`,
        },
      ],
      // max_tokens: 300, //having the max tokens can cause it to stop writing mid json.
    })

  return response.body
}

interface Stories {
  englishStory: string
  germanStory: string
}

export const useChatGPT = ({ englishStory, germanStory }: Stories) => {
  // console.log(API_KEY)
  return useQuery({
    queryKey: ['chatgpt', englishStory, germanStory],
    queryFn: () => fetchChatGPTResponse(englishStory, germanStory),
    enabled: !!englishStory && !!germanStory,
  })
}
