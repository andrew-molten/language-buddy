import { useState } from 'react'
import { PracticePhrase } from '../../../models/stories'
import { PhraseProficiency } from '../../../models/dojo'

interface Props {
  phrase: PracticePhrase
  setProgress: (newprogress: {
    currentWord: number
    lessonsToRetry: boolean
    proficiencyChange: PhraseProficiency[]
  }) => void
  progress: {
    currentWord: number
    lessonsToRetry: boolean
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

  function checkIfLessonsNeedRedoing(proficiencyArr: PhraseProficiency[]) {
    const flatPassedArr = proficiencyArr.map((phrase) => phrase.passed)
    return flatPassedArr.includes(false)
  }

  // function findNextSentence(currentSentence) {
  //   // if any of the sentences.passed after the currentSentence are true, then the next lesson is the index of the first sentence.passed
  //   // otherwise the next sentence is the current sentence + 1
  // }

  function updateStates() {
    const newProficiencyArr = [...progress.proficiencyChange]
    newProficiencyArr[progress.currentWord] = {
      points:
        newProficiencyArr[progress.currentWord].points +
        lessonOutcome.proficiencyPoint,
      passed: lessonOutcome.passed,
    }

    const lessonsToRetry = checkIfLessonsNeedRedoing(newProficiencyArr)

    // const nextSentence = findNextSentence(progress.currentWord)

    const newProgress = {
      lessonsToRetry: lessonsToRetry,
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

  function handleFinish() {
    console.log('Finnniiiiished!!!!')
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
        <>
          <p className={`${lessonOutcome.class} message`}>
            {lessonOutcome.message}
          </p>{' '}
          {progress.currentWord < 9 || progress.lessonsToRetry === true ? (
            <button
              className={`${lessonOutcome.class} btn`}
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className={`${lessonOutcome.class} btn`}
              onClick={handleFinish}
            >
              Finish
            </button>
          )}
        </>
      ) : (
        ''
      )}
    </div>
  )
}

export default WordChunks
