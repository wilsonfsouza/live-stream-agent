import { GoogleGenAI } from '@google/genai'
import { env } from '../env/index.ts'

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

const model = env.GEMINI_MODEL

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: 'Transcribe the audio to US English. Be precise and natural in the transcription. Use the necessary punctuation and separate the text into paragraphs when appropriate.',
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      },
    ],
  })

  if (!response.text) {
    throw new Error('It was not possible convert the audio')
  }

  return response.text
}
