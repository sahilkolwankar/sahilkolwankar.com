import { useEffect, useState } from 'react'

interface UseTypewriterOptions {
  words: string[]
  /** Hold duration per word, in ms. A single number applies to all words; an array maps by index (last value repeats for extra words). */
  holdMs?: number | number[]
  /** Per-character type speed, in ms. A single number applies to all words; an array maps by index (last value repeats for extra words). */
  typeMs?: number | number[]
  /** Per-character delete speed, in ms. A single number applies to all words; an array maps by index (last value repeats for extra words). */
  deleteMs?: number | number[]
  pauseMs?: number
}

export function useTypewriter({
  words,
  holdMs = 1600,
  typeMs = 55,
  deleteMs = 30,
  pauseMs = 400,
}: UseTypewriterOptions) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting' | 'pausing'>('typing')

  useEffect(() => {
    const current = words[wordIndex % words.length]
    const hold = Array.isArray(holdMs) ? (holdMs[wordIndex % words.length] ?? holdMs.at(-1) ?? 1600) : holdMs
    const deleteSpeed = Array.isArray(deleteMs)
      ? (deleteMs[wordIndex % words.length] ?? deleteMs.at(-1) ?? 30)
      : deleteMs
    const typeSpeed = Array.isArray(typeMs) ? (typeMs[wordIndex % words.length] ?? typeMs.at(-1) ?? 55) : typeMs

    if (phase === 'typing') {
      if (text.length < current.length) {
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('holding'), hold)
      return () => clearTimeout(t)
    }

    if (phase === 'holding') {
      const t = setTimeout(() => setPhase('deleting'), 0)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (text.length > 0) {
        const t = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('pausing'), pauseMs)
      return () => clearTimeout(t)
    }

    // pausing
    const t = setTimeout(() => {
      setWordIndex((i) => (i + 1) % words.length)
      setPhase('typing')
    }, 0)
    return () => clearTimeout(t)
  }, [text, phase, wordIndex, words, holdMs, typeMs, deleteMs, pauseMs])

  return text
}
