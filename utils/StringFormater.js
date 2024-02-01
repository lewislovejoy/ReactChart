// Number options
/*
  decimalPoint	-	Decimal point. (e.g. 123.56)	'.' (dot)
  thousandsSeparator	-	Thousand separators. (e.g. 1 000 000)	'' (empty string)
  round	-	Precision (e.g. 0.001 for 3 decimal places or 1000 for rounding to thousands, use 1 to round to whole numbers)
  percentage	-	Whether to add _% (space percentage) suffix and times the number by 100. (e.g. 0.124 -> 12.4 %)
  humanize	- GENERAL_SUFFIXES, GENERAL_NAME_SUFFIXES,SI_SUFFIXES, SI_NAME_SUFFIXES,IT_SUFFIXES, IT_NAME_SUFFIXES,TIME_SUFFIXES, TIME_NAME_SUFFIXES
  plus	-	Whether to append + to numbers greater then zero.	false
  prefix	-	Prepends the given prefix.	'' (empty string)
  suffix -
 */

// Date options
/*
  Date: ('D MMM YYYY'),
  DateSec: () => (value) => dayjs(value * 1000).format('D MMM YYYY'),
  DateTimeSec: () => (value) => dayjs(value * 1000).format('D MMM YYYY, h:mm a'),
  DateTime: () => (value) => dayjs(value).format('D MMM YYYY, h:mm a'),
  Time: () => (value) => dayjs(value).format('mm:ss'),
 */

import {
  format,
  GENERAL_SUFFIXES, GENERAL_NAME_SUFFIXES,
  SI_SUFFIXES, SI_NAME_SUFFIXES,
  IT_SUFFIXES, IT_NAME_SUFFIXES,
  TIME_SUFFIXES, TIME_NAME_SUFFIXES
} from '@alesmenzel/number-format';
import dayjs from 'dayjs';

const allHuman = {
  GENERAL_SUFFIXES,
  GENERAL_NAME_SUFFIXES,
  SI_SUFFIXES,
  SI_NAME_SUFFIXES,
  IT_SUFFIXES,
  IT_NAME_SUFFIXES,
  TIME_SUFFIXES,
  TIME_NAME_SUFFIXES
};

const formaters = {
  Number: (formatOptions) => format(formatOptions?.humanize
    ? { ...formatOptions, humanize: allHuman[formatOptions?.humanize] }
    : formatOptions),
  Date: (formatOptions) => (value) => dayjs(value).format(formatOptions),
  Age: () => (value) => dayjs(value).fromNow()
};

export default function StringFormater(formatOptions) {
  return formaters[formatOptions.type]
    ? formaters[formatOptions.type](formatOptions?.options)
    : formaters.Number(formatOptions?.options);
}

export const STR_FORMATTERS = {
  num: StringFormater({ type: 'Number', options: { thousandsSeparator: ',' /* humanize: 'GENERAL_SUFFIXES' */ } })
};
