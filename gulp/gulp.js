import {series, parallel} from 'gulp'

import {clean} from './tasks/clean'
import {sync} from './tasks/sync'
import {localesList} from './tasks/locales'
import {font} from './tasks/font'
import {internationalise} from './tasks/internationalise'
import {
    polymerStyleTranspile, polymerStyleTranspileWatch,
    polymerMarkupTranspile, polymerMarkupTranspileWatch,
    polymerScriptTranspile, polymerScriptTranspileWatch,
    angularMarkupTranspile, angularMarkupTranspileWatch,
    angularStyleTranspile, angularStyleTranspileWatch,
    angularScriptTranspile, angularScriptTranspileWatch
} from './tasks/transpile'

export {sync}
export {localesList}
export {font}
export {internationalise}

export const angular = parallel(
    series(angularMarkupTranspile, angularMarkupTranspileWatch),
    series(angularStyleTranspile, angularStyleTranspileWatch),
    series(angularScriptTranspile, angularScriptTranspileWatch)
)

export const polymer = parallel(
    series(polymerStyleTranspile, polymerStyleTranspileWatch),
    series(polymerMarkupTranspile, polymerMarkupTranspileWatch),
    series(polymerScriptTranspile, polymerScriptTranspileWatch)
)

export const start = parallel(
    localesList,
    // angular,
    polymer
)

// export const build = parallel(
//     polymerStyleTranspile,
//     polymerMarkupTranspile,
//     polymerScriptTranspile,
//     angularMarkupTranspile,
//     angularStyleTranspile,
//     angularScriptTranspile
// )

export default series(clean, start)