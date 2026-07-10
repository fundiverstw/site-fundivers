import { writable } from 'svelte/store'

// The Wreck Maze easter egg. The game itself is mounted once in App.svelte, but
// the thing that opens it (the nav mascot) lives several components away, so
// the open state is shared here rather than threaded through props.
export const gameOpen = writable(false)

export function openGame(): void {
  gameOpen.set(true)
}
