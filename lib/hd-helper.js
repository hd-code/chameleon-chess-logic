"use strict";
/*! hd-helper v1.1.0 | Hannes Dröse | https://github.com/hd-code/hd-helper | MIT */function deepClone(e){return JSON.parse(JSON.stringify(e))}function flattenArray(e){return e.reduce(function(e,r){return e.concat(r)},[])}function isBool(e){return"boolean"==typeof e}function isNumber(e){return"number"==typeof e}function isInteger(e){return isNumber(e)&&Math.floor(e)===e}function isString(e){return"string"==typeof e}function isDate(e){return e instanceof Date}function isArray(e,r){if(!Array.isArray(e))return!1;if(!r)return!0;for(var t=0,n=e.length;t<n;t++)if(!r(e[t]))return!1;return!0}function isObject(e){return"object"==typeof e&&null!==e&&!isArray(e)}function isKeyOfObject(e,r,t){return"object"==typeof e&&null!==e&&void 0!==e[r]&&(!t||t(e[r]))}Object.defineProperty(exports,"__esModule",{value:!0}),exports.deepClone=deepClone,exports.flattenArray=flattenArray,exports.isBool=isBool,exports.isNumber=isNumber,exports.isInteger=isInteger,exports.isString=isString,exports.isDate=isDate,exports.isArray=isArray,exports.isObject=isObject,exports.isKeyOfObject=isKeyOfObject;