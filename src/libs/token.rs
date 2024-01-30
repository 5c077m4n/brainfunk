#[derive(Debug, PartialEq, Eq)]
pub enum Token {
	/// `+`
	Inc,
	/// `-`
	Dec,
	/// `>`
	Next,
	/// `<`
	Prev,
	/// `[`
	LoopStart,
	/// `]`
	LoopEnd,
	/// `,`
	Input,
	/// `.`
	Output,
	/// Anything else
	Comment,
}

impl From<u8> for Token {
	fn from(value: u8) -> Self {
		match value {
			b'+' => Self::Inc,
			b'-' => Self::Dec,
			b'>' => Self::Next,
			b'<' => Self::Prev,
			b'[' => Self::LoopStart,
			b']' => Self::LoopEnd,
			b',' => Self::Input,
			b'.' => Self::Output,
			_ => Self::Comment,
		}
	}
}
