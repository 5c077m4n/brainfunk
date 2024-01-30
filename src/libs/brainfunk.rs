use std::collections::HashMap;

use anyhow::{bail, Result};

use super::token::Token;

const TAPE_SIZE: usize = 30_000;

pub struct Brainfunk {
	matches: HashMap<usize, usize>,
	instruction_pointer: usize,
	tape: Vec<u8>,
	tape_pointer: usize,
	program: Vec<Token>,
	input: String,
	input_pointer: usize,
}
impl Brainfunk {
	pub fn new(program: &str, input: &str) -> Self {
		let program = program
			.chars()
			.map(|c| Token::from(c as u8))
			.filter_map(|token| match token {
				Token::Comment => None,
				other => Some(other),
			})
			.collect::<Vec<Token>>();
		let input = input.to_string();
		Self {
			matches: HashMap::new(),
			instruction_pointer: 0,
			tape: vec![0u8; TAPE_SIZE],
			tape_pointer: 0,
			program,
			input,
			input_pointer: 0,
		}
	}

	fn populate_matches(&mut self) -> Result<()> {
		let mut stack: Vec<usize> = vec![];

		for (index, token) in self.program.iter().enumerate() {
			match token {
				Token::LoopStart => stack.push(index),
				Token::LoopEnd => match stack.pop() {
					Some(latest_match) => {
						self.matches.insert(latest_match, index);
						self.matches.insert(index, latest_match);
					}
					None => bail!(
						"Right bracket does not have a matching left bracket @ char #{}",
						index
					),
				},
				_ => (),
			}
		}
		if !stack.is_empty() {
			bail!("Left bracket does not have a matching right bracket")
		}
		Ok(())
	}

	pub fn run(&mut self) -> Result<String> {
		self.populate_matches()?;

		let mut output = "".to_string();

		while self.instruction_pointer < self.program.len() {
			match self.program[self.instruction_pointer] {
				Token::Inc => {
					self.tape[self.tape_pointer] = self.tape[self.tape_pointer].wrapping_add(1);
					self.instruction_pointer += 1;
				}
				Token::Dec => {
					self.tape[self.tape_pointer] = self.tape[self.tape_pointer].wrapping_sub(1);
					self.instruction_pointer += 1;
				}
				Token::Next => {
					self.tape_pointer += 1;
					if self.tape_pointer >= self.tape.len() {
						bail!("Pointer overflow")
					}
					self.instruction_pointer += 1;
				}
				Token::Prev => {
					if self.tape_pointer == 0 {
						bail!("Pointer underflow")
					}
					self.tape_pointer -= 1;
					self.instruction_pointer += 1;
				}
				Token::LoopStart => {
					if self.tape[self.tape_pointer] == 0 {
						self.instruction_pointer = self.matches[&self.instruction_pointer];
					} else {
						self.instruction_pointer += 1;
					}
				}
				Token::LoopEnd => {
					if self.tape[self.tape_pointer] != 0 {
						self.instruction_pointer = self.matches[&self.instruction_pointer];
					} else {
						self.instruction_pointer += 1;
					}
				}
				Token::Input => {
					self.tape[self.tape_pointer] = match self.input.chars().nth(self.input_pointer)
					{
						Some(c) => c as u8,
						None => 0,
					};
					self.input_pointer += 1;
					self.instruction_pointer += 1;
				}
				Token::Output => {
					output += &String::from(self.tape[self.tape_pointer] as char);
					self.instruction_pointer += 1;
				}
				Token::Comment => unreachable!(),
			}
		}

		Ok(output)
	}
}
