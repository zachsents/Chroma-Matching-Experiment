import { customAlphabet } from "nanoid"
import { lowercase } from "nanoid-dictionary"


export const lowercaseRandomString = customAlphabet(lowercase, 10)


/**
 * Converts a string to a valid collection name.
 *
 * @param {string} str
 * @return {string} 
 */
export function convertToUnderscoreName(str) {
    return str
        // remove all non-alphanumeric characters
        .replaceAll(/[^\w ]/g, "")
        // replace all spaces with underscores
        .replaceAll(" ", "_")
        // lowercase the string
        .toLowerCase()
        // slice the string to 30 characters
        .slice(0, 30)
        // add a random string to the end
        + "_" + lowercaseRandomString()
}