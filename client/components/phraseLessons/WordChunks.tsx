import { useState } from 'react'
import { PracticePhrase } from '../../../models/stories'
import { ProgressState } from '../../../models/dojo'

interface Props {
  phrase: PracticePhrase
  setProgress: (newprogress: ProgressState) => void
  progress: ProgressState
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
    lessonsNeedRetry: progress.lessonsNeedRetry,
    newFailedLessons: progress.failedLessons,
    attemptedAll: progress.attemptedAll,
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
    const passed = guess === phrase.phrase
    const newFailedLessons = updateFailedLessons(passed)
    const lessonsNeedRetry = checkIfLessonsNeedRedoing(newFailedLessons)
    const attemptedAll = getAttemptedAll(
      progress.currentWord,
      progress.attemptedAll,
    )
    if (passed) {
      setLessonOutcome({
        proficiencyPoint: 1,
        message: 'Well done!',
        class: 'pass',
        passed: true,
        lessonsNeedRetry: lessonsNeedRetry,
        newFailedLessons: newFailedLessons,
        attemptedAll: attemptedAll,
      })
    } else {
      setLessonOutcome({
        proficiencyPoint: -1,
        message: `Oops, correct answer is: ${phrase.phrase}`,
        class: 'fail',
        passed: false,
        lessonsNeedRetry: lessonsNeedRetry,
        newFailedLessons: newFailedLessons,
        attemptedAll: attemptedAll,
      })
    }
  }

  // Next step is to check if this is the last lesson, and go back through any lessons that need to be repeated.

  function handleNext() {
    updateStates()
  }

  function checkIfLessonsNeedRedoing(failedLessonsArr: number[]) {
    return failedLessonsArr.length > 0
  }

  function findNextSentence(
    currentSentence: number,
    lessonsNeedRetry: boolean,
    attemptedAll: boolean,
    failedLessons: number[],
  ) {
    // ALL LESSONS PASSED
    if (attemptedAll && !lessonsNeedRetry) return currentSentence
    // HAVEN'T ATTEMPTED ALL
    if (!attemptedAll) {
      return currentSentence + 1
    }
    // RETRY LESSONS
    if (attemptedAll && lessonsNeedRetry) {
      if (failedLessons.includes(currentSentence)) {
        const indexInFailedLessons = failedLessons.indexOf(currentSentence)
        // CURRENT SENTENCE IS LAST IN ARRAY - RESTART
        if (indexInFailedLessons === failedLessons.length - 1) {
          return failedLessons[0]
        } else return failedLessons[indexInFailedLessons + 1] // NEXT
      } else return failedLessons[0] // START
      // FINISHED ALL
    } else return currentSentence
  }

  function updateFailedLessons(passed: boolean) {
    const newFailedLessons = [...progress.failedLessons]
    // ADD FAILED LESSON
    if (!passed && !newFailedLessons.includes(progress.currentWord)) {
      newFailedLessons.push(progress.currentWord)
    }
    // REMOVE PASSED LESSON
    if (passed && newFailedLessons.includes(progress.currentWord)) {
      const index = newFailedLessons.indexOf(progress.currentWord)
      newFailedLessons.splice(index, 1)
    }
    return newFailedLessons
  }

  function getAttemptedAll(currWord: number, attemptedAll: boolean) {
    if (currWord === 9 || attemptedAll === true) return true
    else return false
  }

  function updateStates() {
    const newProficiencyArr = [...progress.proficiencyChange]
    newProficiencyArr[progress.currentWord] = {
      points:
        newProficiencyArr[progress.currentWord].points +
        lessonOutcome.proficiencyPoint,
      passed: lessonOutcome.passed,
    }

    const nextSentenceIndex = findNextSentence(
      progress.currentWord,
      lessonOutcome.lessonsNeedRetry,
      lessonOutcome.attemptedAll,
      lessonOutcome.newFailedLessons,
    )

    const newProgress = {
      lessonsNeedRetry: lessonOutcome.lessonsNeedRetry,
      attemptedAll: lessonOutcome.attemptedAll,
      currentWord: nextSentenceIndex,
      failedLessons: lessonOutcome.newFailedLessons,
      proficiencyChange: [...newProficiencyArr],
    }

    // newProgress.proficiencyChange[progress.currentWord]

    // setLessonOutcome({
    //   proficiencyPoint: 0,
    //   message: '',
    //   class: '',
    //   passed: false,
    //   lessonsNeedRetry: progress.lessonsNeedRetry,
    //   newFailedLessons: progress.failedLessons,
    // })
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
          {!lessonOutcome.attemptedAll ||
          lessonOutcome.lessonsNeedRetry === true ? (
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
