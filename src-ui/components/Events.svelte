<script>
  // @ts-nocheck
  import { midiEvent, midiEvents } from "../store"
  export let fileName = null
  let evtSource = null
  let uploadedFile = null
  const tracks = {}
  $: if (fileName) {
    uploadedFile = `Uploaded: ${fileName}\n`
  }

  $: if ($midiEvent) {
    putEventToChannel($midiEvent)
  }

  const putEventToChannel = (midiEvent) => {
    console.log("midiEvent", midiEvent)
    console.log("midiEvents", $midiEvents)
    const track = midiEvent.track
    const previousEvents = tracks[track]
    tracks[track] = previousEvents
      ? [...previousEvents, midiEvent]
      : [midiEvent]
  }
</script>

<h3>Playback Events:</h3>
{#if uploadedFile}
  <div>{uploadedFile}</div>
{/if}
<div class="card tracks-card">
  {#each Object.entries(tracks) as [key, eventsList]}
    <div class="flex">Track# {key}</div>
    <div class="flex">
      {#each eventsList as event}
        <span class="inline-span">
          <table class="event">
            <tbody>
              <tr>
                <td>{event.noteName}</td>
                <td>{event.tick}</td>
              </tr>
            </tbody>
          </table>
        </span>
      {/each}
    </div>
  {/each}
</div>

<style>
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .event {
    background-color: antiquewhite;
    color: #777;
    margin: 3px;
  }
  .event td {
    border: 1px solid gray;
  }
  .tracks-card {
    display: inline-block;
  }
</style>
