import { NewWord, PhraseCorrection, StoryData } from '../../models/stories'

interface Props {
  data: StoryData
}

function DisplayStory({ data }: Props) {
  return (
    <>
      <div className="black-card-container">
        <h2 className="secondary-color">Your stories</h2>
        <p>
          <strong>{data.language_native}:</strong> {data.story_one}
        </p>
        <p className="mt-2">
          <strong>{data.language_learning}:</strong> {data.story_two}
        </p>
      </div>
      <div className="black-card-container">
        <h2>AI translation</h2>
        <p>{data.story_translated}</p>
      </div>
      <div className="black-card-container">
        <h2>Sentences learnt</h2>
        <ul>
          {JSON.parse(data.corrections).map(
            (correction: PhraseCorrection, index: number) => {
              return (
                <li key={correction.sentenceCorrection.slice(0, 3) + index}>
                  <strong>{correction.sentenceCorrection}</strong>{' '}
                  {correction.translation}
                </li>
              )
            },
          )}
        </ul>
      </div>
      <div className="black-card-container">
        <h2>Words learnt</h2>
        <ul>
          {JSON.parse(data.new_words).map((newWord: NewWord) => {
            return (
              <li key={newWord.word}>
                <strong>{newWord.word}</strong>({newWord.grammaticalForm}):{' '}
                {newWord.definition}
                <br />
                Lemma: {newWord.lemma} - {newWord.lemmaDefinition}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default DisplayStory
