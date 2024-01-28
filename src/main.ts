import { Brainfunk } from "./lib/brainfunk.ts";

import { parseArgs } from "../deps.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
	const args = parseArgs(Deno.args);
	const output = new Brainfunk(args.eval, args.input).run();

	console.log(output);
}
