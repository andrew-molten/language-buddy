import { useState } from 'react'
import { PracticePhrase } from '../../../models/stories'
import { PhraseProficiency } from '../../../models/dojo'

interface Props {
  phrase: PracticePhrase
  setProgress: (newprogress: {
    currentWord: number
    proficiencyChange: PhraseProficiency[]
  }) => void
  progress: {
    currentWord: number
    proficiencyChange: PhraseProficiency[]
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
    class: '',
    passed: false,
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
      setLessonOutcome({
        proficiencyPoint: 1,
        message: 'Well done!',
        class: 'pass',
        passed: true,
      })
    } else {
      setLessonOutcome({
        proficiencyPoint: -1,
        message: `Oops, correct answer is: ${phrase.phrase}`,
        class: 'fail',
        passed: false,
      })
    }
  }

  // Next step is to check if this is the last lesson, and go back through any lessons that need to be repeated.

  function handleNext() {
    updateStates()
  }

  function updateStates() {
    const newProficiencyArr = [...progress.proficiencyChange]
    newProficiencyArr[progress.currentWord] = {
      points:
        newProficiencyArr[progress.currentWord].points +
        lessonOutcome.proficiencyPoint,
      passed: lessonOutcome.passed,
    }
    const newProgress = {
      currentWord: progress.currentWord + 1,
      proficiencyChange: [...newProficiencyArr],
    }
    newProgress.proficiencyChange[progress.currentWord]
    setLessonOutcome({
      proficiencyPoint: 0,
      message: '',
      class: '',
      passed: false,
    })
    setPhraseOptions([])
    setGuessSentence([])
    setProgress({ ...newProgress })
  }

  return (
    <div>
      <p>{phrase.translation}</p>
      <div className="guess-div">
        {guessSentence.map((word, i) => (
          <button
            className="word-btn"
            key={word + i + 'guess'}
            onClick={handleGuessClick}
          >
            {word}
          </button>
        ))}
      </div>
      <div className="options-div">
        {phraseOptions.map((word, i) => (
          <button
            className="word-btn"
            key={word + i + 'option'}
            onClick={handleOptionClick}
          >
            {word}
          </button>
        ))}
      </div>
      {!lessonOutcome.message && (
        <button className="go-btn btn" onClick={handleSubmit}>
          Go
        </button>
      )}
      {lessonOutcome.message.length > 0 ? (
        <div>
          <p className={`${lessonOutcome.class} message`}>
            {lessonOutcome.message}
          </p>{' '}
          <button className={`${lessonOutcome.class} btn`} onClick={handleNext}>
            Next
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default WordChunks
