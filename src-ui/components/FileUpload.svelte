<script>
  // @ts-nocheck

  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()
  let files // this will be a FileList
  let file

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
    const audioResponse = await fetch(
      `/api/download/${encodeURIComponent(data.folder)}/${encodeURIComponent(data.audioFile)}`,
    )
    const blob = await new Response(audioResponse.body).blob();
    let audioUrl = URL.createObjectURL(blob)
    console.log("DATA", data, audioResponse, audioUrl)

    dispatch("uploaded", {
      fileName: data.midiFile,
      folderName: data.folder,
      audioUrl
    })
  }

</script>

<input type="file" bind:files accept=".zip" />
<button on:click={upload}>Upload</button>
