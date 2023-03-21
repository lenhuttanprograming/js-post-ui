import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncateText } from './common.js'

dayjs.extend(relativeTime)

export function createPost(post) {
  if (!post) return

  //find and clone template
  try {
    const postItemTemplate = document.getElementById('postItemTemplate')
    if (!postItemTemplate) return

    const liPost = postItemTemplate.content.firstElementChild.cloneNode(true)

    setTextContent(liPost, '[data-id="title"]', post.title)

    if (post.description === undefined) post.description = ''
    setTextContent(liPost, '[data-id="description"]', truncateText(post.description, 150))

    if (post.author === undefined) post.author = ''
    setTextContent(liPost, '[data-id="author"]', post.author)

    if (post.imageUrl === undefined) post.imageUrl = ''
    const thumbnailPost = liPost.querySelector('[data-id="thumbnail"]')
    if (thumbnailPost) {
      thumbnailPost.src = post.imageUrl
      thumbnailPost.addEventListener('error', () => {
        thumbnailPost.src = 'https://placehold.jp/1368x400.png?text=DuyxTong'
      })
    }

    setTextContent(liPost, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)

    // add event when user click post
    const divPost = liPost.firstElementChild
    if (divPost)
      divPost.addEventListener('click', (event) => {
        if (!divPost.dataset.editClick) {
          const menu = liPost.querySelector('[data-id="menu"]')
          if (menu && menu.contains(event.target)) return
          window.location.assign(`/post-detail.html?id=${post.id}`)
          console.log('parent click')
        }
      })

    const editBtn = liPost.querySelector('[data-id="edit"]')
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        window.location.assign(`/add-edit-post.html?id=${post.id}`)
        console.log('edit post click')
      })
    }

    const removeBtn = liPost.querySelector('[data-id="remove"]')
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        const customEvent = new CustomEvent('post-delete', { bubbles: true, detail: post })
        removeBtn.dispatchEvent(customEvent)
      })
    }

    return liPost
  } catch (error) {
    console.log('createPost failed')
  }
}

export function renderPostList(postList) {
  if (!Array.isArray(postList)) return

  const ulPostList = document.getElementById('postsList')
  if (!ulPostList) return

  ulPostList.textContent = ''

  postList.forEach((post) => {
    const liPost = createPost(post)
    ulPostList.appendChild(liPost)
  })
}
