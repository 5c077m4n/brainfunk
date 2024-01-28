import { assertThrows } from "../dev_deps.ts";
import { assertEquals } from "../dev_deps.ts";

import { Brainfunk } from "./lib/brainfunk.ts";

Deno.test(function helloWorldWithCommentsTest() {
	const output = new Brainfunk(
		`+++++ +++              Set Cell #0 to 8
		[
			>++++               Add 4 to Cell #1; this will always set Cell #1 to 4
			[                   as the cell will be cleared by the loop
				>++             Add 4*2 to Cell #2
				>+++            Add 4*3 to Cell #3
				>+++            Add 4*3 to Cell #4
				>+              Add 4 to Cell #5
				<<<<-           Decrement the loop counter in Cell #1
			]                   Loop till Cell #1 is zero
			>+                  Add 1 to Cell #2
			>+                  Add 1 to Cell #3
			>-                  Subtract 1 from Cell #4
			>>+                 Add 1 to Cell #6
			[<]                 Move back to the first zero cell you find; this will
								be Cell #1 which was cleared by the previous loop
			<-                  Decrement the loop Counter in Cell #0
		]                       Loop till Cell #0 is zero

		The result of this is:
		Cell No :   0   1   2   3   4   5   6
		Contents:   0   0  72 104  88  32   8
		Pointer :   ^

		>>.                     Cell #2 has value 72 which is 'H'
		>---.                   Subtract 3 from Cell #3 to get 101 which is 'e'
		+++++ ++..+++.          Likewise for 'llo' from Cell #3
		>>.                     Cell #5 is 32 for the space
		<-.                     Subtract 1 from Cell #4 for 87 to give a 'W'
		<.                      Cell #3 was set to 'o' from the end of 'Hello'
		+++.----- -.----- ---.  Cell #3 for 'rl' and 'd'
		>>+.                    Add 1 to Cell #5 gives us an exclamation point
		>++.                    And finally a newline from Cell #6`,
	).run();
	assertEquals(output, "Hello World!\n");
});

Deno.test(function helloWorldTest() {
	const output = new Brainfunk(
		"++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.",
	).run();
	assertEquals(output, "Hello World!\n");
});

Deno.test(function helloWorldCorrectSpacingTest() {
	const output = new Brainfunk(
		"++++++++[>++++++++<-]>++++++++.>++++++++[>++++++++++++<-]>+++++.+++++++..+++.>++++++++[>+++++<-]>++++.------------.<<<<+++++++++++++++.>>.+++.------.--------.>>+.",
	).run();
	assertEquals(output, "Hello, World!");
});

Deno.test(function catTest() {
	const inputs = [
		"Hello, World!",
		"This should be the same as before",
		",[.,]",
	];
	for (const input of inputs) {
		const output = new Brainfunk(",[.,]", input).run();
		assertEquals(output, input);
	}
});

Deno.test(function missingLoopStartTest() {
	const interp = new Brainfunk(",.],", "Should error");
	assertThrows(
		interp.run,
		"Right bracket does not have a matching left bracket",
	);
});

Deno.test(function missingLoopEndTest() {
	const interp = new Brainfunk(",[.,", "Should error");
	assertThrows(
		interp.run,
		"Left bracket does not have a matching right bracket",
	);
});
