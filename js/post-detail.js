import dayjs from 'dayjs'
import postApi from './api/postApi'
import { registerLightBox } from './utils'
import { setTextContent } from './utils/common'

// id = 'postHeroImage'
// id = 'postDetailTitle'
// id = 'postDetailAuthor'
// id = 'postDetailTimeSpan'

function createPostDetail(data) {
  const postHeroImage = document.getElementById('postHeroImage')
  if (postHeroImage) {
    postHeroImage.style.backgroundImage = `url("${data.imageUrl}")`

    postHeroImage.addEventListener('error', () => {
      postHeroImage.style.backgroundImage = 'url("https://placehold.jp/1368x400.png?text=DuyxTong")'
    })
  }

  setTextContent(document, '#postDetailTitle', data.title)
  setTextContent(document, '#postDetailAuthor', data.author)
  setTextContent(document, '#postDetailTimeSpan', dayjs(data.updatedAt).format(' - MM/DD/YY HH:mm'))
  setTextContent(document, '#postDetailDescription', data.description)

  const editPost = document.getElementById('goToEditPageLink')
  if (editPost) {
    editPost.href = `/add-edit-post.html?id=${data.id}`
    editPost.innerHTML = '<i class="fas fa-edit"></i> Edit Post'
  }
}

;(async () => {
  try {
    const url = new URL(window.location)
    const idParam = url.searchParams.get('id')

    const data = await postApi.getById(idParam)

    createPostDetail(data)
  } catch (error) {
    console.log('failed to get data')
  }

  registerLightBox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  })

  registerLightBox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  })
})()
