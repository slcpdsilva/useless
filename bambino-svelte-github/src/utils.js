export function fromNow(then) {
	const elapsed = ((new Date().getTime()) - then) / 1000;

	const SECONDS_IN_A_MINUTE = 60;
	const SECONDS_IN_AN_HOUR = 60 * SECONDS_IN_A_MINUTE;
	const SECONDS_IN_A_DAY = 24 * SECONDS_IN_AN_HOUR;
	const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY;
	const SECONDS_IN_A_MONTH = 4 * SECONDS_IN_A_WEEK;
	const SECONDS_IN_A_YEAR = 12 * SECONDS_IN_A_MONTH;

	if (elapsed < SECONDS_IN_A_MINUTE) {
		return 'just now';
	} else if (elapsed >= SECONDS_IN_A_MINUTE && elapsed < SECONDS_IN_AN_HOUR) {
		if (elapsed < (2 * SECONDS_IN_A_MINUTE)) {
			return '1 minute ago';
		} else {
			return Math.floor(elapsed / SECONDS_IN_A_MINUTE) + ' minutes ago';
		}
	} else if (elapsed >= SECONDS_IN_AN_HOUR && elapsed < SECONDS_IN_A_DAY) {
		if (elapsed < (2 * SECONDS_IN_AN_HOUR)) {
			return '1 hour ago';
		} else {
			return Math.floor(elapsed / SECONDS_IN_AN_HOUR) + ' hours ago';
		}			
	} else if (elapsed >= SECONDS_IN_A_DAY && elapsed < SECONDS_IN_A_WEEK) {
		if (elapsed < (2 * SECONDS_IN_A_DAY)) {
			return '1 day ago';
		} else {
			return Math.floor(elapsed / SECONDS_IN_A_DAY) + ' days ago';
		}			
	} else if (elapsed >= SECONDS_IN_A_WEEK && elapsed < SECONDS_IN_A_MONTH) {
		if (elapsed < (2 * SECONDS_IN_A_WEEK)) {
			return '1 week ago';
		} else {
			return Math.floor(elapsed / SECONDS_IN_A_WEEK) + ' weeks ago';
		}			
	} else if (elapsed >= SECONDS_IN_A_MONTH && elapsed < SECONDS_IN_A_YEAR) {
		if (elapsed < (2 * SECONDS_IN_A_MONTH)) {
			return '1 month ago';
		} else {
			return Math.floor(elapsed / SECONDS_IN_A_MONTH) + ' month ago';
		}			
	} else if (elapsed >= SECONDS_IN_A_YEAR) {
		if (elapsed < (2 * SECONDS_IN_A_YEAR)) {
			return '1 year ago';
		} else {
			return Math.floor(elapsed / SECONDS_IN_A_YEAR) + ' years ago';
		}			
	}
}