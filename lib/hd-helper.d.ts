/*! hd-helper v1.0.0 | Hannes Dröse | https://github.com/hd-code/hd-helper | MIT */
/**
 * Deep-clones the passed object.
 *
 * Attention: If the object contains any functions, they will be removed.
 */
export declare function deepClone<T>(original: T): T;
/**
 * Flattens a passed `n`-dimensional array. So after flattening the resulting
 * array as `n - 1` dimensions.
 *
 * This is a pure function, so the original array will not be altered.
 */
export declare function flattenArray<T>(original: T[][]): T[];
/** Type guard to check if a value is a `boolean`. */
export declare function isBool(bool: any): bool is boolean;
/** Type guard to check if a value is a `number`. */
export declare function isNumber(num: any): num is number;
/** Type guard to check if a value is a `string`. */
export declare function isString(str: any): str is string;
/** Type guard to check if a value is a JS Date type. */
export declare function isDate(date: any): date is Date;
/**
 * Type guard to check if a value is an `array`.
 *
 * Optional: You can pass a type guard (`function`) as a second argument. This
 * will perform a type check on each element of the array. If the type check
 * fails on any element, the function will return false;
 */
export declare function isArray<T>(a: any, typeGuard?: (e: any) => e is T): a is T[];
/**
 * Type guard to check if a value is an object. If the value is `null`, the type
 * guard will reject the value. However, just an empty object (like this: `{}`)
 * is valid.
 *
 * If you want to check the object for specific keys, use `isKeyOfObject()`.
 */
export declare function isObject(obj: any): obj is object;
/**
 * Type guard to check if a value is an `object` and also contains the specified
 * `key`. (`{ key: ... }`)
 *
 * Optional: You can pass a type guard as a third argument to this function. If
 * the given key is found, the value associated with that key is then
 * type-checked by the type guard.
 */
export declare function isKeyOfObject<T, U>(obj: any, key: keyof T, keyTypeGuard?: (e: any) => e is U): obj is T;
