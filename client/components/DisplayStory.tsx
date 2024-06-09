function DisplayStory(data) {
  console.log(data)
  // const parsedContent = JSON.parse(data)
  // add guards against corrections, words or translation not being available
  console.log(data)
  return (
    <div className="story-difference">
      <h1>Differences</h1>
      {/* <p>AI translation: {parsedContent.translatedGermanStory}</p> */}
      <h2>Corrections</h2>
      <ul>
        {/* {parsedContent.corrections.map(
          (correction: PhraseCorrection, index: number) => {
            return (
              <li key={correction.germanSentenceCorrection.slice(0, 3) + index}>
                <strong>{correction.germanSentenceCorrection}</strong>{' '}
                {correction.translation}
              </li>
            )
          },
        )} */}
      </ul>
      <h2>New words</h2>
      <ul>
        {/* {parsedContent.wordsToAddToVocabulary.map((newWord: NewWord) => {
          return (
            <li key={newWord.word}>
              <strong>{newWord.word}</strong>({newWord.grammaticalForm}):{' '}
              {newWord.definition}
              <br />
              Lemma: {newWord.lemma}
              Lemma definition: {newWord.lemmaDefinition}
            </li>
          )
        })} */}
      </ul>
      <h2>Well used words</h2>
      <ul>
        {/* {parsedContent.wellUsedWords.map((word: Word) => {
          return <li key={word.word}>{word.word}</li>
        })} */}
      </ul>
      {/* <p>Corrections: {messageContent.corrections}</p> */}
      {/* <p>New words: {messageContent.wordsToAddToVocabulary}</p> */}
    </div>
  )
}

export default DisplayStory
