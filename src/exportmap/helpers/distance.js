import {numeral} from './number';
import browserLocale from 'browser-locale';

const metersToMiles = 0.621371 / 1000;
const metersToFeet = 3.28084;

export function isMetric() {
	try {
		let locale = browserLocale().toLowerCase().replace("-","_");
		if(locale == 'en_us') return false;
		return true;
	} catch(err) {
		return true;
	}
}

export function milesToMetric(m) {
	return m / (1000 * metersToMiles);
}

export function toImperial(m) {
	let feet = m * metersToFeet ;
	let miles = m * metersToMiles;
	return {
		feet,
		miles
	}
}

export function formatDistance(meters, opts = {}) {
	
	var format = '0.0';
	const formatSm = '0';
	
	let {atomic, small_unit, cleverFloat} = opts;
	
	if(!isMetric()) {
		let feet = meters * metersToFeet ;
		let miles = meters * metersToMiles;
		if(miles > 0.1 && !small_unit) {
			if(cleverFloat && miles > 99) format = '0';

			let value = numeral(miles).format(format);
			let label = `${value} mi`;
			let unit = `mi`;
			return !atomic ? label : {value, unit, label};
		} else {
			if(cleverFloat) format = '0';

			let value = numeral(feet).format(formatSm);
			let label = `${value} ft`;
			let unit = `ft`;

			return !atomic ? label : {value, unit, label};
		}
	} else {
		let kilometers = meters / 1000;
		if(kilometers > 0.1 && !small_unit) {
            if(kilometers > 100 && cleverFloat) format = '0';
            
			let value = numeral(kilometers).format(format);
            let label = `${value} km`;
			let unit = `km`;

			return !atomic ? label : {value, unit, label};
		} else {
			if(cleverFloat) format = '0';

			let value = numeral(meters).format(formatSm);
            let label = `${value} m`;
			let unit = `m`;

			return !atomic ? label : {value, unit, label};
		}
	}
}