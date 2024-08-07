import { useDojoPhrases } from '../hooks/useDojo'
import WordChunks from '../components/phraseLessons/WordChunks'
import { useState } from 'react'
import { ProgressState } from '../../models/dojo'
import { useQueryClient } from '@tanstack/react-query'
import { User } from '../../models/admin'

function Dojo() {
  // get 10 phrases, with all of the definitions of the word
  const queryClient = useQueryClient()
  const user: User[] | undefined = queryClient.getQueryData(['user'])
  const learningLanguage = user![0].learningLanguage
  const nativeLanguage = user![0].nativeLanguage
  const dojoPhrases = useDojoPhrases(learningLanguage, nativeLanguage)
  const [progress, setProgress] = useState<ProgressState>({
    currentSentence: 0,
    lessonsNeedRetry: false,
    attemptedAll: false,
    failedLessons: [],
    proficiencyChange: [
      { points: 0 },
      { points: 0 },
      { points: 0 },
      { points: 0 },
      { points: 0 },
      { points: 0 },
      { points: 0 },
      { points: 0 },
      { points: 0 },
      { points: 0 },
    ],
  })

  if (dojoPhrases.isPending) {
    return <p>Loading..</p>
  }
  if (dojoPhrases.isError) {
    return <p>{String(dojoPhrases.error)}</p>
  }

  // remove fullstops etc from words to test

  // add an option to skip & delete a sentence if you don't like it. (Are you sure)

  // when you get to the end of the ten questions, it goes back to any that you failed on

  // Once they have all passed finish lesson and update the proficiency in the database

  return (
    <div className="dojo-container">
      <h2>Dojo</h2>
      {dojoPhrases.data.length > 9 ? (
        <WordChunks
          key={progress.currentSentence}
          phrase={dojoPhrases.data[progress.currentSentence]}
          setProgress={setProgress}
          progress={progress}
        />
      ) : (
        <p>{`Hey friend👋 Use the story checker some more... You need ${10 - dojoPhrases.data.length} more ${learningLanguage} sentences to use the dojo.`}</p>
      )}
    </div>
  )
}
export default Dojo

// option to try typing instead of buttons (either check directly, or have sentence alternatives, or check with chatgpt if it was close enough to be correct)
