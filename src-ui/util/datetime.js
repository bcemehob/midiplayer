// @ts-nocheck
export const formattedDateTime = timestamp => {
    const date = new Date(timestamp)
    const formatted = date.toLocaleDateString("et-EE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
    return formatted
}
