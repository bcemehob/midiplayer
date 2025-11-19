<script>
  // @ts-nocheck

  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()
  let files
  let file
  let folder
  let midiFile
  let audioFile

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
    folder = data.folder
    midiFile = data.midiFile
    audioFile = data.audioFile
    const audioResponse = await fetch(
      `/api/download/${encodeURIComponent(folder)}/${encodeURIComponent(audioFile)}`,
    )
    const analyzis = await fetch(
      `/api/analyze/${encodeURIComponent(folder)}/${encodeURIComponent(midiFile)}`,
    )
    const blob = await new Response(audioResponse.body).blob()
    let audioUrl = URL.createObjectURL(blob)

    dispatch("uploaded", {
      fileName: midiFile,
      folderName: folder,
      audioUrl,
      analyzis
    })
  }
</script>

<input type="file" bind:files accept=".zip" on:change={upload} />
