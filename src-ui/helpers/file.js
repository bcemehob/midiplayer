// @ts-nocheck
export function downloadFile(blob, fileName) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

export async function downloadAudio() {
    const audioResponse = await fetch("/api/audio")
    const blob = await new Response(audioResponse.body).blob()
    return URL.createObjectURL(blob)
}

export async function compressProject() {
    if (!confirm("Are you sure you want to compress this project?")) return
    const resp = await fetch("/api/compress", { method: "POST" })
    downloadFile(await resp.blob(), projectFileName(resp))
}

function projectFileName(resp) {
    const disposition = resp.headers.get("Content-Disposition") || ""
    const match = disposition.match(/filename="?([^"]+)"?/)
    return !match || match.length < 2 ? "current_project.mpr" : match[1]
}

export async function loadAnalysis() {
    const res = await fetch("/api/analyze")
    return await res.json()
}

export async function loadLatest() {
    const res = await fetch("/api/latest")
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
}
