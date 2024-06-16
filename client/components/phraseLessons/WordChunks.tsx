import { useState } from 'react'
import { PracticePhrase } from '../../../models/stories'

interface Props {
  phrase: PracticePhrase
  setProgress: (newprogress: {
    currentWord: number
    proficiencyChange: number[]
  }) => void
  progress: {
    currentWord: number
    proficiencyChange: number[]
  }
}

function WordChunks({ phrase, setProgress, progress }: Props) {
  const options = phrase.phrase.split(' ')
  shuffleArr(options)
  const [phraseOptions, setPhraseOptions] = useState(options)
  const [guessSentence, setGuessSentence] = useState<string[]>([])
  const [lessonOutcome, setLessonOutcome] = useState({
    proficiencyPoint: 0,
    message: '',
  })

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

  function handleSubmit() {
    const guess = guessSentence.join(' ')
    if (guess === phrase.phrase) {
      setLessonOutcome({ proficiencyPoint: 1, message: 'Well done!' })
    } else {
      setLessonOutcome({ proficiencyPoint: -1, message: 'Oops' })
    }
  }

  function handleNext() {
    const newProficiencyArr = [...progress.proficiencyChange]
    newProficiencyArr[progress.currentWord] = lessonOutcome.proficiencyPoint
    const newProgress = {
      currentWord: progress.currentWord + 1,
      proficiencyChange: [...newProficiencyArr],
    }
    newProgress.proficiencyChange[progress.currentWord]
    setLessonOutcome({ proficiencyPoint: 0, message: '' })
    setPhraseOptions([])
    setGuessSentence([])
    setProgress({ ...newProgress })
  }

  return (
    <div>
      <p>{phrase.translation}</p>
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
      <button className="go-btn" onClick={handleSubmit}>
        Go
      </button>
      {lessonOutcome.message.length > 0 ? (
        <div>
          <p>{lessonOutcome.message}</p>{' '}
          <button onClick={handleNext}>Next</button>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default WordChunks
