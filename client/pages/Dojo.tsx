import { useDojoPhrases } from '../hooks/useDojo'
import WordChunks from '../components/phraseLessons/WordChunks'
import { useState } from 'react'

function Dojo() {
  // get 10 phrases, with all of the definitions of the word
  const languageLearning = 'German'
  const languageNative = 'English'
  const dojoPhrases = useDojoPhrases(languageLearning, languageNative)
  const [progress, setProgress] = useState({
    currentWord: 0,
    proficiencyChange: [
      { points: 0, passed: false },
      { points: 0, passed: false },
      { points: 0, passed: false },
      { points: 0, passed: false },
      { points: 0, passed: false },
      { points: 0, passed: false },
      { points: 0, passed: false },
      { points: 0, passed: false },
      { points: 0, passed: false },
      { points: 0, passed: false },
    ],
  })

  if (dojoPhrases.isPending) {
    return <p>Loading..</p>
  }
  if (dojoPhrases.isError) {
    return <p>{String(dojoPhrases.error)}</p>
  }

  console.log(dojoPhrases.data)
  console.log(progress)

  // remove fullstops etc from words to test

  // add an option to skip & delete a sentence if you don't like it. (Are you sure)

  // when you get to the end of the ten questions, it goes back to any that you failed on

  // Once they have all passed finish lesson and update the proficiency in the database

  return (
    <div className="dojo-container">
      <h2>Dojo</h2>
      {dojoPhrases.data.length > 9 ? (
        <WordChunks
          key={progress.currentWord}
          phrase={dojoPhrases.data[progress.currentWord]}
          setProgress={setProgress}
          progress={progress}
        />
      ) : (
        <p>{`Use the story checker some more first. You need ${10 - dojoPhrases.data.length} more sentences corrected to use the dojo.`}</p>
      )}
    </div>
  )
}
export default Dojo

// option to try typing instead of buttons (either check directly, or have sentence alternatives, or check with chatgpt if it was close enough to be correct)
