const uid = function() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

const formatDateTime = function(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
}

const favIcon = function(url, size = 128) {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`
}

document.addEventListener('alpine:init', () => {
  Alpine.store('search', {
    q: Alpine.$persist('').as('unblank.search.q'),
    action: Alpine.$persist('//www.google.com/search').as('unblank.search.action'),
    clear() {
      this.q = ''
    },
    providers: [],
    addProvider(provider) {
      this.providers.push(provider)
    },
    removeProvider(provider) {
      this.providers = this.providers.filter(p => p !== provider)
    },
  })

  Alpine.store('links', {
    entries: Alpine.$persist([]).as('unblank.links.entries'),
    displayList: Alpine.$persist(false).as('unblank.links.displayList'),
    add({ target }) {
      const data = new FormData(target)
      this.entries.push({
        id: uid(),
        name: data.get('name'),
        url: data.get('url'),
        created_at: new Date(),
      })
    },
    remove(id) {
      this.entries = this.entries.filter(l => l.id !== id)
    },
    clear() {
      this.entries = []
    },
    get length() {
      return this.entries.length
    },
    get isEmpty() {
      return this.length === 0
    },
  })
})