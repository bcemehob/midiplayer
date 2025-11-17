<script>
  import FileUpload from "./components/FileUpload.svelte";
  import Controls from "./components/Controls.svelte";
  import Events from "./components/Events.svelte";

  let fileName = null;
</script>

<h1>MIDI Player</h1>

<FileUpload on:uploaded={(e) => fileName = e.detail.fileName} />
<Controls {fileName} />
<Events {fileName} />