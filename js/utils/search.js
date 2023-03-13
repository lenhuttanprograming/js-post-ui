import debounce from 'lodash.debounce'

export function initSearch({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId)
  if (!searchInput) return

  if (defaultParams.get('title_like')) searchInput.value = defaultParams.get('title_like')

  const debounceInput = debounce(() => {
    onChange(searchInput.value)
  }, 500)

  searchInput.addEventListener('input', debounceInput)
}
