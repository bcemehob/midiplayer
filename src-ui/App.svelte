<script>
// @ts-nocheck

  import FileUpload from "./components/FileUpload.svelte"
  import Controls from "./components/Controls.svelte"
  import Events from "./components/Events.svelte"

  let fileName = null
  let folderName = null
  let audioUrl = null
</script>

<h1>MIDI Player</h1>

<FileUpload on:uploaded={e => {
  fileName = e.detail.fileName
  folderName = e.detail.folderName
  audioUrl = e.detail.audioUrl
  }} />
<Controls {fileName} {folderName} {audioUrl} />
<Events {fileName} {folderName}/>