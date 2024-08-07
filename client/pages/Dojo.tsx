import { useDojoPhrases, useUpdatePhrases } from '../hooks/useDojo'
import WordChunks from '../components/phraseLessons/WordChunks'
import { useState } from 'react'
import { ProgressState } from '../../models/dojo'
import { useQueryClient } from '@tanstack/react-query'
import { User } from '../../models/admin'
import { PracticePhrase } from '../../models/stories'

function Dojo() {
  // get 10 phrases
  const queryClient = useQueryClient()
  const user: User[] | undefined = queryClient.getQueryData(['user'])
  const learningLanguage = user![0].learningLanguage
  const nativeLanguage = user![0].nativeLanguage
  const dojoPhrases = useDojoPhrases(learningLanguage, nativeLanguage)
  const updatePhrases = useUpdatePhrases()
  const emptyProgress = {
    lessonStarted: false,
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
  }
  const [progress, setProgress] = useState<ProgressState>(emptyProgress)

  function handleStart() {
    setProgress({ ...progress, lessonStarted: true })
  }

  async function handleFinish() {
    const phrasesToUpdate = dojoPhrases.data.map(
      (phrase: PracticePhrase, i: number) => {
        return {
          id: phrase.userPhraseId,
          proficiency:
            phrase.proficiency + progress.proficiencyChange[i].points,
        }
      },
    )
    await updatePhrases.mutateAsync(phrasesToUpdate)
    setProgress(emptyProgress)
  }

  if (dojoPhrases.isPending) {
    return <p>Loading..</p>
  }
  if (dojoPhrases.isError) {
    return <p>{String(dojoPhrases.error)}</p>
  }

  // remove fullstops etc from words to test

  // add an option to skip & delete a sentence if you don't like it. (Are you sure)

  return (
    <div className="dojo-container">
      {progress.lessonStarted ? (
        <>
          <h2>Dojo</h2>
          {dojoPhrases.data.length > 9 ? (
            <WordChunks
              key={progress.currentSentence}
              phrase={dojoPhrases.data[progress.currentSentence]}
              setProgress={setProgress}
              progress={progress}
              handleFinish={handleFinish}
            />
          ) : (
            <p>{`Hey friend👋 Use the story checker some more... You need ${10 - dojoPhrases.data.length} more ${learningLanguage} sentences to use the dojo.`}</p>
          )}{' '}
        </>
      ) : (
        <button className="go-btn btn" onClick={handleStart}>
          Start lesson
        </button>
      )}
    </div>
  )
}
export default Dojo

// option to try typing instead of buttons (either check directly, or have sentence alternatives, or check with chatgpt if it was close enough to be correct)
