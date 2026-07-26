const ctx = new AudioContext();

const notes = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    A4: 440.00,
    B4: 493.88,
    C5: 523.25
} as const // importante: "as const" trava os valores como literais e o objeto como readonly

type NotesKeys = keyof typeof notes


export class Sound{
    constructor(
        public oscType: OscillatorType,
        public notes: NotesKeys | number,
    ){}

    static get Builder(){
        return new SoundBuilder()
    }

    async play(){
        if (ctx.state === "suspended") {
            await ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = this.oscType
        osc.frequency.value = (typeof this.notes === "string"? notes[this.notes]: this.notes);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.05
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    }
}

export class SoundBuilder{
    public oscType!: OscillatorType
    public notes!: NotesKeys | number

    setOscType(type: OscillatorType){
        this.oscType = type
        return this
    }

    setNote(note: NotesKeys | number){
        this.notes = note
        return this
    }

    build(): Sound{
        return new Sound(this.oscType, this.notes)
    }
}