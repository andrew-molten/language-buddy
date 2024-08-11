import { Phrase } from '../../models/dojo'

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffleArr<Type>(arr: Type[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[r]
    arr[r] = temp
  }
}

export function popAndPushPhrase(
  popFrom: Phrase[],
  pushTo: Phrase[],
  numPhrases: number,
) {
  for (let i = 0; i < numPhrases; i++) {
    if (popFrom.length > 0) {
      const popped = popFrom.pop()
      pushTo.push(popped!)
    }
  }
}
