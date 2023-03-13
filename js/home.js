import postApi from './api/postApi'
import { initPagination, initSearch, renderPostList, renderPagination } from './utils'

async function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location)
  url.searchParams.set(filterName, filterValue)

  // handle filterchange search title
  if (filterName === 'title_like') url.searchParams.set('_page', 1)
  history.pushState({}, '', url)

  // fetch API
  const { data, pagination } = await postApi.getAll(url.searchParams)
  renderPostList(data)
  renderPagination('postsPagination', pagination)

  // re-render post list
}

function getQueryParams() {
  const url = new URL(window.location)

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
  history.pushState({}, '', url)

  return url.searchParams
}

;(async () => {
  try {
    const params = getQueryParams()

    initPagination({
      elementId: 'postsPagination',
      defaultParams: params,
      onChange: (page) => handleFilterChange('_page', page),
    })
    initSearch({
      elementId: 'searchId',
      defaultParams: params,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    const { data, pagination } = await postApi.getAll(params)

    renderPostList(data)
    renderPagination('postsPagination', pagination)
  } catch (error) {
    console.log('getAll failed', error)
  }
})()
