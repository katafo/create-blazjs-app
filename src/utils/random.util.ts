import { randomUUID } from 'crypto'

export const CHARACTERS_AND_NUMBER =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const randomString = (
  length: number,
  characters: string = CHARACTERS_AND_NUMBER,
): string => {
  const charactersLength = characters.length
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters.charAt(randomIndex)
  }

  return result
}

export const randomID = () => {
  return randomUUID().replace(/-/g, '')
}
