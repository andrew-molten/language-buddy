import { useState } from 'react'
import { PracticePhrase } from '../../../models/stories'

interface Props {
  phrase: PracticePhrase
}

function WordChunks({ phrase }: Props) {
  const options = phrase.translation.split(' ')
  shuffleArr(options)
  const [phraseOptions, setPhraseOptions] = useState(options)
  // need to randomize after the split
  const [guessSentence, setGuessSentence] = useState<string[]>([])

  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  function shuffleArr(arr: string[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1))
      const temp = arr[i]
      arr[i] = arr[r]
      arr[r] = temp
    }
  }

  function handleOptionClick(e: React.MouseEvent<HTMLButtonElement>) {
    const clicked = (e.nativeEvent.target as HTMLElement)?.textContent
    setGuessSentence([...guessSentence, clicked!])
    const newPhraseOptions = [...phraseOptions]
    const indexOf = newPhraseOptions.indexOf(clicked!)
    newPhraseOptions.splice(indexOf, 1)
    setPhraseOptions(newPhraseOptions)
  }

  function handleGuessClick(e: React.MouseEvent<HTMLButtonElement>) {
    const clicked = (e.nativeEvent.target as HTMLElement)?.textContent
    console.log(phraseOptions, clicked)
    setPhraseOptions([...phraseOptions, clicked!])
    const newGuessSentence = [...guessSentence]
    const indexOf = newGuessSentence.indexOf(clicked!)
    newGuessSentence.splice(indexOf, 1)
    setGuessSentence(newGuessSentence)
  }

  // add button to check if the guess was correct

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
