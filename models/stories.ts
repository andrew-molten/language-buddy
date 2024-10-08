export interface CheckedStory {
  correctTranslatedStory: string
  corrections: PhraseCorrection[]
  wordsToAddToVocabulary: NewWord[]
  wellUsedWords: Word[]
  shortSummary: string
}

export interface PhraseCorrection {
  sentenceCorrection: string
  translation: string
  explanations: string[]
}

export interface PhraseCorrectionWithId extends PhraseCorrection {
  id: number
  language: string
}

export interface NewWord {
  word: string
  definition: string
  grammaticalForm: string
  lemma: string
  lemmaDefinition: string
  gender: string
}

export interface Word {
  word: string
}

export interface Id {
  id: number
}

export interface Stories {
  nativeStory: string
  learningLanguageStory: string
  nativeLanguage: string
  learningLanguage: string
}

export interface Message {
  message: { content: string; role: string }
}

export interface Lemma {
  id: number
  word: string
  language: string
}

export interface LemmasData {
  lemmasToAdd: NewWord[]
  existingLemmas: Lemma[]
}

export interface WordsData {
  wordsToAdd: WordToAdd[]
  existingWords: DBWord[]
}
export interface PhraseData {
  phrasesToAdd: PhraseCorrection[]
  existingPhrases: DBPhrase[]
}

export interface DBPhrase {
  id: number
  phrase: string
  language: string
}

export interface WordToAdd extends NewWord {
  lemma_id?: number | null
}

export interface WordToAddWithDefinition extends WordToAdd {
  definition: string
  word_id?: number
}

export interface DBWord {
  id: number
  lemma_id?: number
  word: string
  grammatical_form?: string
}
export interface DefinitionToAdd extends DBWord {
  definition: string
  word_id?: number
}

export interface WordPhraseAssociation {
  wordId: number
  phraseIdArr: number[]
}
export interface DBWordPhraseAssociation {
  id: number
  word_id: number
  phrase_id: number
}

export interface BackendCheckedStory extends CheckedStory {
  story_one: string
  story_two: string
  language_native: string
  language_learning: string
  user_id: number
  date_added: string
  token_usage: TokenUsage
}

export interface BackendStory extends BackendCheckedStory {
  lemmasData: LemmasData
  wordsData: WordsData
  usersNewWordIds: Id[]
  definitionsToAdd: DefinitionToAdd[]
  phraseData: PhraseData
  usersNewPhraseIds: DBPhrase[]
}

export interface StoryData {
  id: number
  new_words: string
  well_used_words: string
  story_translated: string
  story_one: string
  story_two: string
  language_native: string
  language_learning: string
  user_id: number
  date_added: string
  corrections: string
  short_summary: string
}

export interface DBVocabWord {
  id: number
  definition: string
  definition_language: string
  grammatical_form: string
  lemma_id: number
  proficiency: number
  user_id: number
  word: string
  word_id: number
}

export interface VocabWordWithDefinitions extends DBVocabWord {
  definitions: string[]
}

export interface TokenUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}
