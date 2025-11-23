// @ts-nocheck
const sseClient = {
    eventSource: null,
    getEventSource: () => {
        if (!!sseClient.eventSource) return sseClient.eventSource
        console.log("New SSE client registered")
        sseClient.eventSource = new EventSource("/api/events")
        sseClient.eventSource.onmessage = evt => {
            const data = JSON.parse(evt.data)
            window.dispatchEvent(new CustomEvent("sse-update", {
                detail: data
            }))
        }
        return sseClient.eventSource
    }
}

export default sseClient
