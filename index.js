// https://regex101.com/r/SQrOlx/14
export default function issueRegex() {
	return /(?<!\w)(?:(?<organization>[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?)\/(?<repository>[\w.-]{1,100}))?(?<!(?:\/\.{1,2}))#(?<issueNumber>[1-9]\d{0,9})\b/gi;
}
