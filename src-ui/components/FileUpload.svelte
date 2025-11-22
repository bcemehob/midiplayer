<script>
  // @ts-nocheck

  import { createEventDispatcher, onMount } from "svelte"

  const dispatch = createEventDispatcher()
  let files
  let file
  let folder
  let midiFile
  let audioFile
  let projects
  let selectedProject

  onMount(async () => {
    const latestProject = await loadLatest()
    const res = await fetch("/api/projects")
    projects = await res.json()
    selectedProject = latestProject.folder && Number(latestProject.folder)
    await emitProjectData(
      latestProject.folder,
      latestProject.midiFile,
      latestProject.audioFile,
    )
  })

  async function loadLatest() {
    const res = await fetch("/api/latest")
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  }

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

  async function changeProject() {
    const res = await fetch(`/api/project/${selectedProject}`)
    const data = await res.json()
    await emitProjectData(data.folder, data.midiFile, data.audioFile)
  }

  async function deleteProject() {
    await fetch(`/api/project/${selectedProject}`, { method: "DELETE" })
    const latestProject = await loadLatest()
    selectedProject = latestProject
    const res = await fetch("/api/projects")
    projects = await res.json()
    await emitProjectData(data.folder, data.midiFile, data.audioFile)
  }

  async function emitProjectData(folder, midiFile, audioFile) {
    dispatch("updated", {
      fileName: midiFile,
      folderName: folder,
      audioUrl: await downloadAudio(folder, audioFile),
      analyzis: await loadAnalysis(folder, midiFile),
    })
  }

  async function loadAnalysis(folder, midiFile) {
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

  const getFormattedDateTime = (timestamp) => {
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
</script>

<input type="file" bind:files accept=".zip" on:change={upload} />
<div>
  <select bind:value={selectedProject} on:change={changeProject}>
    {#each projects as opt}
      <option value={opt.value}>{getFormattedDateTime(opt.label)}</option>
    {/each}
  </select>
</div>
<button class="sym" on:click={deleteProject}>⌫</button>
