const notes = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    A4: 440.00,
    B4: 493.88,
    C5: 523.25
} as const

type NotesKeys = keyof typeof notes
type Note = NotesKeys | number
type NoteInput = Note | Note[] // string única ou acorde (array)

interface PlayOptions {
    osc?: OscillatorType
    duration?: number // segundos, tempo total até o som sumir
    gain?: number      // volume de pico (0 a 1)
}

let sharedCtx: AudioContext | null = null
function getContext() {
    if (!sharedCtx) sharedCtx = new AudioContext()
    return sharedCtx
}

export const Sound = {
    async play(note: NoteInput, options: PlayOptions = {}) {
        const { osc = "square", duration = 0.05, gain = 0.1 } = options
        const ctx = getContext()

        if (ctx.state === "suspended") await ctx.resume()

        const freqs = Array.isArray(note) ? note : [note]

        freqs.forEach(n => {
            const oscNode = ctx.createOscillator()
            const gainNode = ctx.createGain()

            oscNode.type = osc
            oscNode.frequency.value = typeof n === "string" ? notes[n] : n

            gainNode.gain.setValueAtTime(gain, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

            oscNode.connect(gainNode).connect(ctx.destination)
            oscNode.start()
            oscNode.stop(ctx.currentTime + duration)
        })
    }
}

export function generateCompleteTaskSound(){
    // composto: pequeno arpejo ascendente, tipo "conquista"
    const sequence: { note: NoteInput; delay: number }[] = [
        { note: "C4", delay: 0 },
        { note: "E4", delay: 60 },
        { note: "G4", delay: 120 },
        { note: ["C5", "E4", "G4"], delay: 180 }, // acorde final
    ]
    
    sequence.forEach(({ note, delay }) => {
        setTimeout(() => {
            Sound.play(note, { osc: "square", duration: 0.12, gain: 0.09 })
        }, delay)
    })
}