// https://regex101.com/r/SQrOlx/14
export default function issueRegex() {
	return /(?:(?<![/\w-.])\w[\w-.]+?\/\w[\w-.]+?|\B)#[1-9]\d*?\b/g;
}
