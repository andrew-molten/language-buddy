import { NewWord, PhraseCorrection, StoryData } from '../../models/stories'

interface Props {
  data: StoryData
}

function DisplayStory({ data }: Props) {
  return (
    <div className="story-difference">
      <h3>Your stories</h3>
      <p>
        {data.language_native}: {data.story_one}
      </p>
      <p>
        {data.language_learning}: {data.story_two}
      </p>
      <h3>AI translation</h3>
      <p>{data.story_translated}</p>
      <h4>Corrections</h4>
      <ul>
        {JSON.parse(data.corrections).map(
          (correction: PhraseCorrection, index: number) => {
            return (
              <li key={correction.germanSentenceCorrection.slice(0, 3) + index}>
                <strong>{correction.germanSentenceCorrection}</strong>{' '}
                {correction.translation}
              </li>
            )
          },
        )}
      </ul>
      <h4>Words learnt</h4>
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
  )
}

export default DisplayStory
