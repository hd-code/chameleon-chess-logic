/** creates clone of passed object. doesn't work if object contains functions */
export function deepClone<T>(original :T) :T {
    return JSON.parse(JSON.stringify(original))
}