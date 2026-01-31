export function markdownToPlainText(text: string): string {
	if (!text) return "";

	let result = text;

	// Normalize line endings to \n
	result = result.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	// Track and restore code blocks to prevent regex interference
	const codeBlocks: string[] = [];
	result = result.replace(/```([\s\S]*?)```/g, (match, code) => {
		codeBlocks.push(match);
		return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
	});

	// Track and restore inline code
	const inlineCodes: string[] = [];
	result = result.replace(/`([^`]+)`/g, (match) => {
		inlineCodes.push(match);
		return `__INLINE_CODE_${inlineCodes.length - 1}__`;
	});

	// Bold: **text** or __text__ → text (remove markers)
	result = result.replace(/\*\*(.+?)\*\*/g, "$1");
	result = result.replace(/__(.+?)__/g, "$1");

	// Italic: *text* or _text_ → text (remove markers)
	result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "$1");
	result = result.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "$1");

	// Strikethrough: ~~text~~ → text (remove markers)
	result = result.replace(/~~(.+?)~~/g, "$1");

	// Spoiler: ||text|| → text (remove markers)
	result = result.replace(/\|\|(.+?)\|\|/g, "$1");

	// Headings: # ## ### → Heading (remove hash marks)
	result = result.replace(/^#{1,6}\s+(.+)$/gm, "$1");

	// Blockquotes: > text → text (remove quote marker)
	result = result.replace(/^>\s*(.+)$/gm, "$1");

	// Links: [text](url) → text (url)
	result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

	// Unordered lists: - or * at line start → •
	result = result.replace(/^[\s]*[-*]\s+/gm, "• ");

	// Ordered lists: keep as is (1. 2. 3.)
	// Already plain text friendly

	// Horizontal rules: --- or *** → ─────────
	result = result.replace(/^[\s]*[-*]{3,}[\s]*$/gm, "─────────────────");

	// Tables - simplify to text representation
	result = result.replace(/\|[^|\n]+\|/g, (match) => {
		return match
			.split("|")
			.filter((cell) => cell.trim())
			.map((cell) => cell.trim())
			.join(" | ");
	});

	// Restore code blocks as plain text (remove backticks, keep content)
	codeBlocks.forEach((code, index) => {
		// Extract language and code content
		const codeMatch = code.match(/```(\w+)?\n?([\s\S]*?)```/);
		if (codeMatch) {
			const lang = codeMatch[1] || "";
			const content = codeMatch[2];
			// Plain text format with language label if present
			const plainCode = lang
				? `[${lang.toUpperCase()} CODE]\n${content}\n[END CODE]`
				: `${content}`;
			result = result.replace(
				new RegExp(`__CODE_BLOCK_${index}__`, "g"),
				plainCode,
			);
		} else {
			result = result.replace(
				new RegExp(`__CODE_BLOCK_${index}__`, "g"),
				code.replace(/```/g, ""),
			);
		}
	});

	// Restore inline code (remove backticks)
	inlineCodes.forEach((code, index) => {
		const plainCode = code.replace(/`/g, "");
		result = result.replace(
			new RegExp(`__INLINE_CODE_${index}__`, "g"),
			plainCode,
		);
	});

	// Clean up multiple consecutive blank lines
	result = result.replace(/\n{3,}/g, "\n\n");

	// Remove leading/trailing whitespace from each line
	result = result
		.split("\n")
		.map((line) => line.trimEnd())
		.join("\n");

	return result.trim();
}
