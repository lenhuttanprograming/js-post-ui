export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId)
  if (!pagination || !ulPagination) return

  //caculate totalPages
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check if is disabled or enable prev page
  if (_page <= 1) ulPagination.firstElementChild.classList.add('disabled')
  else ulPagination.firstElementChild.classList.remove('disabled')

  // check if is disabled or enable next page
  if (_page >= totalPages) ulPagination.lastElementChild.classList.add('disabled')
  else ulPagination.lastElementChild.classList.remove('disabled')
}

export function initPagination({ elementId, defaultParams, onChange }) {
  const paginationElement = document.getElementById(elementId)
  if (!paginationElement) return

  const prevPagination = paginationElement.firstElementChild.firstElementChild
  if (prevPagination)
    prevPagination.addEventListener('click', (e) => {
      e.preventDefault()
      const page = Number(paginationElement.dataset.page)
      if (page > 1) {
        const newPage = page - 1
        onChange(newPage)
      }
    })

  const nextPagination = paginationElement.lastElementChild.lastElementChild
  if (prevPagination)
    nextPagination.addEventListener('click', (e) => {
      e.preventDefault()
      const page = Number(paginationElement.dataset.page)
      const totalPages = Number(paginationElement.dataset.totalPages)

      if (page < totalPages) {
        const newPage = Number.parseInt(page) + 1
        onChange(newPage)
      }
    })
}
