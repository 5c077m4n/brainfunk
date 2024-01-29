const TOKEN = {
	INC: "+",
	DEC: "-",
	NEXT: ">",
	PREV: "<",
	LOOP_START: "[",
	LOOP_END: "]",
	INPUT: ",",
	OUTPUT: ".",
} as const satisfies Record<string, string>;

export class Brainfunk {
	static readonly TAPE_SIZE = 30_000;
	static readonly WORD_SIZE = 256;

	private matches: Record<number, number> = {};
	/** @description Instruction pointer */
	private ip = 0;
	private tape = Array.from({ length: Brainfunk.TAPE_SIZE }, () => 0);
	/** @description Tape pointer */
	private tp = 0;

	constructor(
		private readonly program: string,
		private input = "",
	) {}

	private populateMatches(): void {
		const stack: number[] = [];

		for (let i = 0; i < this.program.length; i++) {
			if (this.program[i] === TOKEN.LOOP_START) {
				stack.push(i);
			} else if (this.program[i] === TOKEN.LOOP_END) {
				const latestMatch = stack.pop();

				if (typeof latestMatch === "undefined") {
					throw Error("Right bracket does not have a matching left bracket");
				}
				this.matches[latestMatch] = i;
				this.matches[i] = latestMatch;
			}
		}
		if (stack.length) {
			throw Error("Left bracket does not have a matching right bracket");
		}
	}

	public run(): string {
		let output = "";
		this.populateMatches();

		while (this.ip < this.program.length) {
			switch (this.program[this.ip]) {
				case TOKEN.INC: {
					this.tape[this.tp]++;
					if (this.tape[this.tp] >= Brainfunk.WORD_SIZE) {
						this.tape[this.tp] = 0;
					}
					this.ip++;

					break;
				}
				case TOKEN.DEC: {
					this.tape[this.tp]--;
					if (this.tape[this.tp] < 0) {
						this.tape[this.tp] = Brainfunk.WORD_SIZE - 1;
					}
					this.ip++;

					break;
				}
				case TOKEN.NEXT: {
					this.tp++;
					if (this.tp >= this.tape.length) {
						throw Error("Pointer overflow");
					}
					this.ip++;

					break;
				}
				case TOKEN.PREV: {
					this.tp--;
					if (this.tp < 0) {
						throw Error("Pointer underflow");
					}
					this.ip++;

					break;
				}
				case TOKEN.INPUT: {
					if (this.input == "") {
						this.tape[this.tp] = 0;
					} else {
						this.tape[this.tp] = this.input.charCodeAt(0) % Brainfunk.WORD_SIZE;
						this.input = this.input.slice(1);
					}
					this.ip++;

					break;
				}
				case TOKEN.OUTPUT: {
					output += String.fromCharCode(this.tape[this.tp]);
					this.ip++;

					break;
				}
				case TOKEN.LOOP_START: {
					if (this.tape[this.tp] === 0) {
						this.ip = this.matches[this.ip];
					} else {
						this.ip++;
					}

					break;
				}
				case TOKEN.LOOP_END: {
					if (this.tape[this.tp] !== 0) {
						this.ip = this.matches[this.ip];
					} else {
						this.ip++;
					}

					break;
				}
				default: {
					this.ip++;
					break;
				}
			}
		}
		return output;
	}
}
