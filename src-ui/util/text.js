// @ts-nocheck
export const shorten = (input, maxLength) => {
    const text = String(input)
    const ret = text.length > maxLength ? ".." + text.slice(-4) : text
    return ret
}
