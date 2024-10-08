import { useState } from 'react'
import { Phrase } from '../../../models/dojo'
import { ProgressState } from '../../../models/dojo'

interface Props {
  phrase: Phrase
  setProgress: (newprogress: ProgressState) => void
  progress: ProgressState
  handleFinish: () => void
}

function WordChunks({ phrase, setProgress, progress, handleFinish }: Props) {
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
    // need to add the index to the words
    const target = e.nativeEvent.target as HTMLElement
    const clicked = target.textContent
    setGuessSentence([...guessSentence, clicked!])
    const newPhraseOptions = [...phraseOptions]
    const indexOf = Number(target.dataset.index!)
    newPhraseOptions.splice(indexOf, 1)
    setPhraseOptions(newPhraseOptions)
  }

  function handleGuessClick(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.nativeEvent.target as HTMLElement
    const clicked = target.textContent
    setPhraseOptions([...phraseOptions, clicked!])
    const newGuessSentence = [...guessSentence]
    const indexOf = Number(target.dataset.index!)
    newGuessSentence.splice(indexOf, 1)
    setGuessSentence(newGuessSentence)
  }

  function handleSubmit() {
    const guess = guessSentence.join(' ')
    const passed = guess.toLowerCase() === phrase.phrase.toLowerCase()
    const newFailedLessons = updateFailedLessons(passed)
    const lessonsNeedRetry = checkIfLessonsNeedRedoing(newFailedLessons)
    const attemptedAll = getAttemptedAll(
      progress.currentSentence,
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
        message: `Oops: ${phrase.phrase}`,
        class: 'fail',
        passed: false,
        lessonsNeedRetry: lessonsNeedRetry,
        newFailedLessons: newFailedLessons,
        attemptedAll: attemptedAll,
      })
    }
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
    if (lessonsNeedRetry) {
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
    if (!passed && !newFailedLessons.includes(progress.currentSentence)) {
      newFailedLessons.push(progress.currentSentence)
    }
    // REMOVE PASSED LESSON
    if (passed && newFailedLessons.includes(progress.currentSentence)) {
      const index = newFailedLessons.indexOf(progress.currentSentence)
      newFailedLessons.splice(index, 1)
    }
    return newFailedLessons
  }

  function getAttemptedAll(currWord: number, attemptedAll: boolean) {
    if (currWord === 9 || attemptedAll === true) return true
    else return false
  }

  function handleNext() {
    const newProficiencyArr = [...progress.proficiencyChange]
    newProficiencyArr[progress.currentSentence] = {
      points:
        newProficiencyArr[progress.currentSentence].points +
        lessonOutcome.proficiencyPoint,
    }

    const nextSentenceIndex = findNextSentence(
      progress.currentSentence,
      lessonOutcome.lessonsNeedRetry,
      lessonOutcome.attemptedAll,
      lessonOutcome.newFailedLessons,
    )

    if (nextSentenceIndex === progress.currentSentence) {
      setGuessSentence([])
      setPhraseOptions(options)
    }

    const newProgress = {
      lessonStarted: progress.lessonStarted,
      lessonsNeedRetry: lessonOutcome.lessonsNeedRetry,
      attemptedAll: lessonOutcome.attemptedAll,
      currentSentence: nextSentenceIndex,
      failedLessons: lessonOutcome.newFailedLessons,
      proficiencyChange: [...newProficiencyArr],
    }

    setLessonOutcome({ ...lessonOutcome, message: '' })
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
            data-index={i}
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
            data-index={i}
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
          <div className={`${lessonOutcome.class} message`}>
            <p>
              <strong>{lessonOutcome.message}</strong>
            </p>{' '}
            {lessonOutcome.class === 'fail' &&
              phrase.explanations &&
              phrase.explanations.length > 0 && (
                <>
                  <h3 className={`${lessonOutcome.class} mt-3`}>
                    Explanations:
                  </h3>
                  <ul>
                    {phrase.explanations?.map((explanation, index) => (
                      <li key={`${index}+${explanation}`} className="ml-3 mt-1">
                        ‣ <em>{explanation}</em>
                      </li>
                    ))}
                  </ul>
                </>
              )}
          </div>
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
              onClick={() => {
                handleFinish()
              }}
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
