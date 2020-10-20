const Router = require('./router')


/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const array = [ {"name": "Cloudflare Profile", "url": "https://dash.cloudflare.com/profile" },
                {"name": "Shaodong's LinkedIn Profile", "url": "https://www.linkedin.com/in/crimsonwong/" },
                {"name": "Shaodong's GitHub", "url": "https://github.com/CrimsonWong" } ]

function displayLinks(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify(array)
    return new Response(body, init)
}

async function displayStaticURL(request) {
    const response = await fetch('https://static-links-page.signalnerve.workers.dev')
    
    return new HTMLRewriter().on("div#links", new AddLinksElementHandler(array))
                             .on("div#profile", new EditProfileElementHandler("profile"))
                             .on("img#avatar", new EditProfileElementHandler("avatar"))
                             .on("h1#name", new EditProfileElementHandler("name"))
                             .on("div#social", new EditSocialElementHandler())
                             .on("title", new ChangeTitleElementHandler())
                             .on("body", new ChangeStyleElementHandler()).transform(response)
}

class AddLinksElementHandler {
    constructor(array) {
      this.linkArray = array
    }
    element(element) {
        for (var i = 0; i < this.linkArray.length; i++) {
            var obj = this.linkArray[i]
            var a = `<a href="${obj.url}">${obj.name}</a>`
            element.append(a, {html:true})
        }
    }
}

class EditProfileElementHandler {
    constructor(type) {
        this.type = type
    }
    element(element) {
        switch(this.type) {
            case "profile" :
                element.removeAttribute("style")
                break
            case "avatar" :
                // A picture selected from Google, literally Avatar
                element.setAttribute("src", "https://m.media-amazon.com/images/M/MV5BMTYwOTEwNjAzMl5BMl5BanBnXkFtZTcwODc5MTUwMw@@._V1_.jpg")
                break
            case "name" :
                element.append("Shaodong Wang")
        }
    }
}

class EditSocialElementHandler {
    element(element) {
        element.removeAttribute("style")
        var a = `<div id="socialLinks">
                    <a href="https://dash.cloudflare.com/profile">
                        <svg width="100%" height="100%" xmlns="https://simpleicons.org/icons/bbciplayer.svg">
                            <circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="#38B2AC"/>
                        </svg>
                    </a>
                </div>`
        element.append(a, {html:true})
    }

}

class ChangeTitleElementHandler {
    element(element) {
        element.replace(`<title>Shaodong Wang</title>`, {html:true})
    }
}

class ChangeStyleElementHandler {
    element(element) {
        element.setAttribute("class", "bg-green-400")
    }
}

async function handleRequest(request) {
    const r = new Router()
    
    // Route
    r.get('/', request => displayStaticURL(request))
    r.get('/links', request => displayLinks(request))

    const resp = await r.route(request)
    return resp
}
