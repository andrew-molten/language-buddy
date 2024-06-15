import { useDojoPhrases } from '../hooks/useDojo'
import WordChunks from '../components/phraseLessons/WordChunks'
import { useState } from 'react'

function Dojo() {
  // get 10 phrases, with all of the definitions of the word
  const languageLearning = 'German'
  const languageNative = 'English'
  const dojoPhrases = useDojoPhrases(1, languageLearning, languageNative)
  const [currentWord, setCurrentWord] = useState(1)

  if (dojoPhrases.isPending) {
    return <p>Loading..</p>
  }
  if (dojoPhrases.isError) {
    return <p>{String(dojoPhrases.error)}</p>
  }

  console.log(dojoPhrases.data)
  // split a phrase into all the words and display them as buttons

  // check whether the buttons were ordered in the correct manner.

  // option to try typing instead of buttons (either check directly, or have sentence alternatives, or check with chatgpt if it was close enough to be correct)

  return (
    <div>
      <h2>Dojo</h2>
      <WordChunks phrase={dojoPhrases.data[currentWord]} />
    </div>
  )
}
export default Dojo
