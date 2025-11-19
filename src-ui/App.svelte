<script>
// @ts-nocheck

  import FileUpload from "./components/FileUpload.svelte"
  import Controls from "./components/Controls.svelte"
  import Events from "./components/Events.svelte"

  let fileName = null
  let folderName = null
  let audioUrl = null
  let analyzis = null
</script>
<div class="header">
  <h4>MIDI Player</h4>
  <FileUpload on:uploaded={e => {
  fileName = e.detail.fileName
  folderName = e.detail.folderName
  audioUrl = e.detail.audioUrl
  analyzis = e.detail.analyzis
  }} />
</div>



<Controls {fileName} {folderName} {audioUrl} />
<Events {fileName} {folderName}/>