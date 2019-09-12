function loadBox() {
  const boxPopup = new BoxSelect()
  boxPopup.success(handleStream)
  boxPopup.cancel(() => {
    console.log("The user clicked cancel or closed the popup");
  })
}

async function handleStream(response) {
  const fileData = await fetch(response[0].url)
  const totalSize = parseInt(fileData.headers.get('Content-Length'))
  const reader = fileData.body.getReader()
  let dataDoneStreaming = 0
  const streamAndRead = async (numChunks = 0) => {
    const chunk = await reader.read()
    if (chunk.done) {
      return numChunks
    }
    numChunks += 1
    dataDoneStreaming += chunk.value.length
    const streamProgress = Math.round((dataDoneStreaming / totalSize) * 100);
    document.getElementById("streamProgress").value = streamProgress
    // DO STUFF TO THE STREAMED DATA HERE BEFORE GOING TO GET NEXT CHUNK
    return streamAndRead(numChunks)
  }
  document.getElementById("filename").innerHTML = `Streaming File: <b><em>${response[0].name}</em><b>`
  document.getElementById("progressBar").style.display = "block"
  const chunkCount = await streamAndRead()
  alert(`Done! Total Chunks of Data Streamed: ${chunkCount}`)
}

window.onload = loadBox