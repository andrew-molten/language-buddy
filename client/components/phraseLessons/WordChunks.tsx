import { useState } from 'react'
import { PracticePhrase } from '../../../models/stories'

interface Props {
  phrase: PracticePhrase
}

function WordChunks({ phrase }: Props) {
  const [phraseOptions, setPhraseOptions] = useState(
    phrase.translation.split(' '),
  )
  const [guessSentence, setGuessSentence] = useState<string[]>([])

  // const splitWords = phrase.translation.split(' ')

  function handleOptionClick(e: React.MouseEvent<HTMLButtonElement>) {
    const clicked = (e.nativeEvent.target as HTMLElement)?.textContent
    setGuessSentence([...guessSentence, clicked!])
    const newPhraseOptions = [...phraseOptions]
    const indexOf = newPhraseOptions.indexOf(clicked!)
    newPhraseOptions.splice(indexOf, 1)
    setPhraseOptions(newPhraseOptions)
    // console.log(currentSentenceGuess)
  }

  function handleGuessClick(e: React.MouseEvent<HTMLButtonElement>) {
    const clicked = (e.nativeEvent.target as HTMLElement)?.textContent
    console.log(phraseOptions, clicked)
    setPhraseOptions([...phraseOptions, clicked!])
    const newGuessSentence = [...guessSentence]
    const indexOf = newGuessSentence.indexOf(clicked!)
    newGuessSentence.splice(indexOf, 1)
    setGuessSentence(newGuessSentence)
    // console.log(currentSentenceGuess)
  }
  console.log('guessSentence', guessSentence)
  console.log('phraseOptions', phraseOptions)

  return (
    <div>
      <p>{phrase.phrase}</p>
      <div className="guess-div">
        {guessSentence.map((word, i) => (
          <button key={word + i + 'guess'} onClick={handleGuessClick}>
            {word}
          </button>
        ))}
      </div>
      <div className="options-div">
        {phraseOptions.map((word, i) => (
          <button key={word + i + 'option'} onClick={handleOptionClick}>
            {word}
          </button>
        ))}
      </div>
    </div>
  )
}

export default WordChunks
