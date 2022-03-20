// https://regex101.com/r/SQrOlx/14
export default function issueRegex() {
	return /(?<![\w./-])(?:(?<org>\w[\w.-]{0,38})\/(?<repo>\w[\w.-]{0,99}))?#(?<num>[1-9]\d{0,99})\b/g;
}
