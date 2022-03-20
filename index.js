// https://regex101.com/r/SQrOlx/14
export default function issueRegex() {
	return /(?<![\w./-])(?:(?<organization>\w[\w.-]{0,38})\/(?<repository>\w[\w.-]{0,99}))?#(?<issueNumber>[1-9]\d{0,99})\b/g;
}
