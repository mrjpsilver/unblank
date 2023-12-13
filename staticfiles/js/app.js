/**
 * Populate form fields from a JSON object.
 *
 * @param {HTMLFormElement} form The form element containing your input fields.
 * @param {object} data JSON data to populate the fields with.
 * @param {string} basename Optional basename which is added to `name` attributes, eg basename[fieldname]
 */
const populate = function(form, data, basename) {
	for (const key in data) {
		if (!data.hasOwnProperty(key)) {
			continue;
		}

		const name = key;
		let value = data[key];

		if ('undefined' === typeof value) {
			value = '';
		}

		if (null === value) {
			value = '';
		}

		// handle array name attributes
		if (typeof (basename) !== "undefined") {
			name = basename + "[" + key + "]";
		}

		if (value.constructor === Array) {
			name += '[]';
		} else if (typeof value == "object") {
			populate(form, value, name);
			continue;
		}


		// only proceed if form has element with the given name attribute
		const element = form.elements.namedItem(name);
		if (!element) {
			continue;
		}

		// set element value
		const type = element.type || element[0].type;
		switch (type) {
			default:
				element.value = value;
				break;

			case 'radio':
			case 'checkbox': {
				const values = value.constructor === Array ? value : [value];
				for (let j = 0; j < element.length; j++) {
					element[j].checked = values.indexOf(element[j].value) > -1;
				}
			}
				break;

			case 'select-multiple': {
				const values = value.constructor === Array ? value : [value];
				for (let k = 0; k < element.options.length; k++) {
					element.options[k].selected = (values.indexOf(element.options[k].value) > -1);
				}
			}
				break;

			case 'select':
			case 'select-one':
				element.value = value.toString() || value;
				break;

			case 'date':
				element.value = new Date(value).toISOString().split('T')[0];
				break;
		}

		// fire change event on element
		const changeEvent = new Event('change', { bubbles: true });
		switch (type) {
			default:
				element.dispatchEvent(changeEvent);
				break;
			case 'radio':
			case 'checkbox':
				for (let j = 0; j < element.length; j++) {
					if (element[j].checked) {
						element[j].dispatchEvent(changeEvent);
					}
				}
				break;
		}

	}
}

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
    edit(id) {
      const entry = this.entries.find(l => l.id === id)
      if (!entry) return
      const form = document.getElementById('edit-link-form')
      try {
        populate(form, entry)
      } catch (e) {
        console.error(e)
      }
    },
    save({ target }) {
      const data = new FormData(target)
      const id = data.get('id')
      const idx = this.entries.findIndex(l => l.id === id)
      if (idx === -1) return
      const entry = this.entries[idx]
      const newData = {
        name: data.get('name'),
        url: data.get('url'),
      }
      this.entries[idx] = Object.assign(entry, newData)
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