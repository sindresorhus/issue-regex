// https://regex101.com/r/SQrOlx/14
export default function issueRegex() {
	return /(?<![\w./-])(?:(\w[\w.-]{0,38})\/(\w[\w.-]{0,99}))?#([1-9]\d{0,99})\b/g;
}
