<script>
  export let fileName = null
  let events = ""
  let evtSource = null

  $: if (fileName && !evtSource) {
    events = `Uploaded: ${fileName}\n`
    console.log("new client creation on file name change: ", fileName)
    evtSource = new EventSource("/api/events")
    evtSource.onmessage = (e) => {
      events += e.data + "\n"
    };
  }
</script>

<h3>Playback Events:</h3>
<pre>{events}</pre>