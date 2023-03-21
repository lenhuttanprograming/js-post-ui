import postApi from './api/postApi'
import { initPagination, initSearch, renderPostList, renderPagination, toast } from './utils'

async function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location)
  if (filterName) url.searchParams.set(filterName, filterValue)

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

let myModal

function getMyModal() {
  const modalId = document.getElementById('removeModal')
  if (!modalId) return

  const myModal = new window.bootstrap.Modal(modalId)
  return myModal
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const modalId = document.getElementById('removeModal')
      modalId.dataset.postId = event.detail.id
      myModal = getMyModal()
      myModal.show()

      // setTimeout(hideModal, 3000)
      return
      const message = 'Are you sure to remove post'
      const post = event.detail

      if (window.confirm(message)) {
        await postApi.remove(post.id)
        await handleFilterChange()

        toast.success('Remove post successfully')
      }
    } catch (error) {
      console.log('failed to remove post', error.message)
      toast.error(error.message)
    }
  })
}

function showRemoveModal() {
  const btnRemove = document.getElementById('btnRemove')
  const modalId = document.getElementById('removeModal')

  if (btnRemove) {
    btnRemove.addEventListener('click', async () => {
      const postId = modalId.dataset.postId
      // await postApi.remove(post.id)
      // await handleFilterChange()

      toast.success('Remove post successfully')
      myModal.hide()
    })
  }
}

;(async () => {
  try {
    const params = getQueryParams()

    registerPostDeleteEvent()
    showRemoveModal()

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

    // const { data, pagination } = await postApi.getAll(params)
    // renderPostList(data)
    // renderPagination('postsPagination', pagination)

    handleFilterChange()
  } catch (error) {
    console.log('getAll failed', error)
  }
})()
