import { NextRequest } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Artifact context data (in production, fetch from Supabase)
const ARTIFACTS: Record<string, {
  name: string
  category: string
  origin: string
  period: string
  personality_tone: string
  speaking_style: string
  description: string
  cultural_value: string
  interesting_facts: string
  source_note: string
}> = {
  'keris-jawa': {
    name: 'Keris Jawa',
    category: 'Senjata Tradisional',
    origin: 'Jawa',
    period: 'Abad ke-9 hingga sekarang',
    personality_tone: 'bijaksana, tenang, penuh filosofi',
    speaking_style: 'Berbicara perlahan dan penuh makna, sering menggunakan metafora',
    description: 'Keris adalah senjata tikam khas Nusantara yang memiliki bilah berlekuk atau lurus. Keris bukan hanya senjata, tetapi juga simbol status, kehormatan, dan identitas budaya.',
    cultural_value: 'Keris dianggap sebagai pusaka keluarga yang diwariskan turun-temurun. Dalam tradisi Jawa, keris memiliki nilai spiritual dan sering dikaitkan dengan kekuatan gaib.',
    interesting_facts: 'Keris diakui UNESCO sebagai Masterpiece of the Oral and Intangible Heritage of Humanity pada tahun 2005. Bentuk bilah keris yang berlekuk disebut luk dan memiliki makna filosofis.',
    source_note: 'UNESCO Intangible Cultural Heritage, Museum Nasional Indonesia',
  },
}

function buildPrompt(artifactId: string, message: string, explanationLevel: string): string {
  const artifact = ARTIFACTS[artifactId]
  if (!artifact) {
    return `Kamu adalah simulasi edukatif dari artefak museum. Jawab pertanyaan berikut dalam bahasa Indonesia: ${message}`
  }

  return `Kamu adalah simulasi edukatif dari artefak bernama ${artifact.name}.
Kamu berbicara dengan gaya ${artifact.personality_tone} dan ${artifact.speaking_style}.

Informasi artefak:
Kategori: ${artifact.category}
Asal: ${artifact.origin}
Periode: ${artifact.period}
Deskripsi: ${artifact.description}
Nilai budaya: ${artifact.cultural_value}
Fakta menarik: ${artifact.interesting_facts}
Sumber: ${artifact.source_note}

Jawablah pertanyaan user dalam bahasa Indonesia yang natural, edukatif, dan menarik.
Gunakan sudut pandang roleplay sebagai artefak (orang pertama), tetapi tetap jelas bahwa ini simulasi pembelajaran.
Jangan mengarang fakta sejarah. Jika data tidak cukup, katakan: "Informasi itu belum dapat kupastikan dari ingatan yang tersedia."
Sesuaikan tingkat penjelasan dengan level: ${explanationLevel}.
Jawab dalam 2-4 kalimat yang padat dan menarik.

Pertanyaan user: ${message}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { artifactId, message, explanationLevel = 'umum' } = body

    if (!message || !artifactId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!GEMINI_API_KEY) {
      // Fallback response when no API key is configured
      return Response.json({
        aiMessage: 'Maaf, suara artefak sedang terputus sebentar. Pastikan GEMINI_API_KEY sudah dikonfigurasi.',
        chatId: null,
        earnedXp: 0,
      })
    }

    const prompt = buildPrompt(artifactId, message, explanationLevel)

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error('Gemini API error:', errText)
      return Response.json({
        aiMessage: 'Maaf, suara artefak sedang terputus sebentar. Coba tanyakan lagi dalam beberapa saat.',
        chatId: null,
        earnedXp: 0,
      })
    }

    const geminiData = await geminiRes.json()
    const aiMessage =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Maaf, aku tidak bisa menjawab saat ini.'

    // TODO: Save to Supabase chat_messages
    // TODO: Check fragment unlock conditions
    // TODO: Update quest progress
    // TODO: Calculate XP

    return Response.json({
      aiMessage,
      chatId: null,
      earnedXp: 10,
      unlockedFragments: [],
      completedQuest: null,
      unlockedBadge: null,
      levelUp: false,
      suggestedNextAction: null,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json({
      aiMessage: 'Maaf, suara artefak sedang terputus sebentar. Coba tanyakan lagi dalam beberapa saat.',
      chatId: null,
      earnedXp: 0,
    })
  }
}
