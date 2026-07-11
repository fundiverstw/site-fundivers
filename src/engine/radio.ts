import { writable } from 'svelte/store'
import { SOCIAL } from '$content/settings'

// The live radio stream, controlled from the nav. One shared <audio> so the
// desktop and mobile buttons drive the same playback — starting on one and
// resizing to the other keeps playing, and either can stop it.
//
//   idle     nothing playing
//   loading  connecting / buffering the stream
//   playing  audio is coming through
//   error    the stream could not be reached (off air, blocked, wrong URL)
export type RadioState = 'idle' | 'loading' | 'playing' | 'error'

export const radioState = writable<RadioState>('idle')

// Mirror the store into a plain variable so toggle() can read it synchronously.
let current: RadioState = 'idle'
radioState.subscribe((v) => (current = v))

// Created on first play, not at import: no <audio> element (and no stream
// connection) exists until a visitor actually asks for it.
let audio: HTMLAudioElement | null = null

function ensureAudio(): HTMLAudioElement {
  if (audio) return audio
  const a = new Audio()
  a.preload = 'none'
  a.addEventListener('playing', () => radioState.set('playing'))
  a.addEventListener('waiting', () => radioState.set('loading'))
  a.addEventListener('error', () => radioState.set('error'))
  audio = a
  return a
}

export function toggleRadio(): void {
  if (current === 'playing' || current === 'loading') {
    stopRadio()
    return
  }
  const a = ensureAudio()
  radioState.set('loading')
  // A live stream has no meaningful resume point; always (re)connect fresh.
  a.src = SOCIAL.radioStream
  a.play().catch(() => radioState.set('error'))
}

export function stopRadio(): void {
  if (!audio) return
  audio.pause()
  // Drop the connection so we are not quietly pulling the stream in the
  // background once the visitor has stopped it.
  audio.removeAttribute('src')
  audio.load()
  radioState.set('idle')
}
