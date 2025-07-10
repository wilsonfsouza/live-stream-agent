import { GoogleGenAI } from '@google/genai'
import { env } from '../env/index.ts'

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

const model = env.GEMINI_AUDIO_TRANSCRIPTION_MODEL

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

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: env.GEMINI_GENERATE_EMBEDDINGS_MODEL,
    contents: [{ text }],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
    },
  })

  const embeddings = response.embeddings?.[0].values

  if (!embeddings) {
    throw new Error('It was not possible to generate embeddings')
  }

  return embeddings
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  const context = transcriptions.join('\n\n')

  const prompt = `
    Using the text provided below as a context, reply to the question clearly and precisely, using US English. 

    CONTEXT:
    ${context}

    QUESTION:
    ${question}

    INSTRUCTIONS:
    - Only use information from the provided context;
    - If an answer is not found in the context, only reply that you do not have enought information to answer the question;
    - Be objective;
    - Keep an educative and professional tone;
    - Reference segments relevants from the context, if appropriate;
    - If you are going to reference the context, use the term "content from class";
  `.trim()

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  })

  if (!response.text) {
    throw new Error('Failed to generate answer by Gemini')
  }

  return response.text
}
