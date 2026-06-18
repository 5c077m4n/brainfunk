mod libs;

use anyhow::Result;
use clap::Parser;
use libs::brainfunk::BrainFunk;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct CLIArgs {
	#[arg(short, long)]
	eval: String,
	#[arg(short, long)]
	input: String,
}

fn main() -> Result<()> {
	let CLIArgs { eval, input } = CLIArgs::parse();
	let mut bf = BrainFunk::new(&eval, &input);

	println!("{}", bf.run()?);
	Ok(())
}
