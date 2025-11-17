<script>
  export let fileName = null;

  async function start() {
    if (!fileName) {
      alert("Upload a file first!");
      return;
    }
    await fetch("/api/start?file=" + encodeURIComponent(fileName));
  }

  async function stop() {
    await fetch("/api/stop");
  }
</script>

<button on:click={start}>Start</button>
<button on:click={stop}>Stop</button>