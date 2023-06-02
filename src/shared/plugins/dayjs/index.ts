import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import { SupportLanguage } from '../vue-i18n'

dayjs.locale(localStorage.getItem('language') ?? SupportLanguage.en)
dayjs.extend(duration)
dayjs.extend(localeData)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
