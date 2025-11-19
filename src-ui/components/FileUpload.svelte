<script>
  // @ts-nocheck

  import { createEventDispatcher, onMount } from "svelte"

  const dispatch = createEventDispatcher()
  let files
  let file
  let folder
  let midiFile
  let audioFile

  onMount(async () => {
    const res = await fetch("/api/latest")
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    await emitProjectData(data.folder, data.midiFile, data.audioFile)
  })

  async function upload() {
    file = files?.[0]
    if (!file) {
      alert("Select file first!")
      return
    }
    const formData = new FormData()
    formData.append("archive", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    await emitProjectData(data.folder, data.midiFile, data.audioFile)
  }

  async function emitProjectData(folder, midiFile, audioFile) {
    dispatch("updated", {
      fileName: midiFile,
      folderName: folder,
      audioUrl: await downloadAudio(folder, audioFile),
      analyzis: await downloadAnalysis(folder, midiFile),
    })
  }

  async function downloadAnalysis(folder, midiFile) {
    return await fetch(
      `/api/analyze/${encodeURIComponent(folder)}/${encodeURIComponent(midiFile)}`,
    )
  }

  async function downloadAudio(folder, audioFile) {
    const audioResponse = await fetch(
      `/api/download/${encodeURIComponent(folder)}/${encodeURIComponent(audioFile)}`,
    )
    const blob = await new Response(audioResponse.body).blob()
    return URL.createObjectURL(blob)
  }
</script>

<input type="file" bind:files accept=".zip" on:change={upload} />