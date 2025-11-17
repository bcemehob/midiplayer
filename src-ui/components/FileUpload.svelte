<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let files; // this will be a FileList
    let file;

    async function upload() {
        file = files?.[0];
        if (!file) {
            alert("Select a MIDI file first!");
            return;
        }
        const formData = new FormData();
        formData.append("midi", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();

        dispatch("uploaded", { fileName: data.file });
    }
</script>

<input type="file" bind:files={files} accept=".mid,.midi" />
<button on:click={upload}>Upload</button>
