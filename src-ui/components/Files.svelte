<script>
  // @ts-nocheck

  import { createEventDispatcher, onMount, onDestroy } from "svelte"
  import {
    downloadAudio,
    loadAnalysis,
    compressProject,
    loadLatest,
  } from "../helpers/file"
  import { formattedDateTime } from "../util/datetime"
  import DragNDrop from "./DragNDrop.svelte"

  const dispatch = createEventDispatcher()
  let files
  let file
  let fileInput
  let folder
  let midiFile
  let audioFile
  let projects
  let selectedProject
  let retryInterval = setInterval(tryLoad, 5000)

  onMount(async () => await tryLoad())

  onDestroy(() => {
    if (retryInterval) clearInterval(retryInterval)
  })

  function selectFile() {
    console.log(fileInput)
    fileInput.click()
  }

  async function tryLoad() {
    try {
      const latestProject = await loadLatest()
      if (retryInterval) {
        clearInterval(retryInterval)
        retryInterval = null
      }
      dispatch("backendStatus", { ready: true })
      const res = await fetch("/api/projects")
      projects = await res.json()
      selectedProject = latestProject.folder && Number(latestProject.folder)
      if (!latestProject.folder) return
      await emitProjectData(
        latestProject.folder,
        latestProject.midiFile,
        latestProject.audioFile,
      )
    } catch (err) {
      console.error("Backend error, will retry:", err.message)
    }
  }

  async function onInputFile() {
    file = files?.[0]
    await upload(file)
  }

  async function upload(file) {
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
    selectedProject = Number(data.folder)
    projects.push({ value: selectedProject, label: selectedProject })
    await emitProjectData(data.folder, data.midiFile, data.audioFile)
  }

  async function changeProject() {
    const res = await fetch(`/api/project/${selectedProject}`)
    const data = await res.json()
    await emitProjectData(data.folder, data.midiFile, data.audioFile)
  }

  async function deleteProject() {
    if (!confirm("Are you sure you want to delete this item?")) return
    await fetch(`/api/project/${selectedProject}`, { method: "DELETE" })
    const latestProject = await loadLatest()
    selectedProject = latestProject.folder && Number(latestProject.folder)
    const res = await fetch("/api/projects")
    projects = await res.json()
    await emitProjectData(
      latestProject.folder,
      latestProject.midiFile,
      latestProject.audioFile,
    )
  }

  async function emitProjectData(folder, midiFile, audioFile) {
    dispatch("updated", {
      fileName: midiFile,
      folderName: folder,
      audioUrl: await downloadAudio(),
      analyzis: await loadAnalysis(),
    })
  }
</script>

<input
  type="file"
  bind:files
  bind:this={fileInput}
  accept=".zip, .mpr"
  on:change={onInputFile}
/>
<DragNDrop onDrop={upload} onClick={selectFile}></DragNDrop>
<div>
  <select bind:value={selectedProject} on:change={changeProject}>
    {#each projects as opt}
      <option value={opt.value}>{formattedDateTime(opt.label)}</option>
    {/each}
  </select>
</div>
<button class="sym" on:click={deleteProject}>⌫</button>
<button class="sym" on:click={compressProject}>⤓</button>

<style>
  input[type="file"] {
    display: none;
  }
</style>
