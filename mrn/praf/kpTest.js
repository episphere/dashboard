function createTokenAtBackend() {
    const requestURL = `https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/getKey`
    const request = fetch(requestURL).then((response) => {
      return response.json().then(jsonResp => {
        jsonResp["expires"] = new Date(response.headers.get("expires"))
        return jsonResp
      })
    }).catch((err) => {
      console.log(err)
    })
    return request
  }

  function submit(token, access_token) {
    const formInput = {
      token
    }
    formInput["kpFName"] = document.getElementById("kpFName").value
    formInput["kpLName"] = document.getElementById("kpLName").value
    formInput["kpMRN"] = document.getElementById("kpMRN").value
    formInput["kpSite"] = document.getElementById("kpSite").value
    const requestURL = `https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/recruit/submit`
    const request = fetch(requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${access_token}`
      },
      body: JSON.stringify(formInput)
    }).then(response => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    })
    return request
  }

  function showToken(token) {
    const p1 = document.createElement("p")
    p1.className = "h3"
    const tokenText = document.createTextNode(`Token created: ${token}`)
    p1.appendChild(tokenText)
    document.getElementById("showToken").appendChild(p1)
    const p2 = document.createElement("p")
    p2.className = "h5"
    const linkText = document.createTextNode(`Check the participant data at: `)
    p2.appendChild(linkText)
    const a = document.createElement("a")
    const siteCode = document.getElementById("kpSite").value
    const href = `https://episphere.github.io/dashboard/recruitParticipant/#token=${token}&siteCode=${siteCode}`
    a.href = href
    a.target = "_blank"
    const linkString = document.createTextNode(href)
    a.appendChild(linkString)
    const lineBreak = document.createElement("br")
    p2.appendChild(lineBreak)
    p2.appendChild(a)
    document.getElementById("showURL").appendChild(p2)
  }

  async function getToken() {
    const {
      access_token,
      token,
      expires
    } = await createTokenAtBackend()
    await submit(token, access_token)
    showToken(token)
  }