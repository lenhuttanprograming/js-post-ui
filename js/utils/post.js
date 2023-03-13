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

    setTextContent(liPost, '[data-id="description"]', truncateText(post.description, 150))

    setTextContent(liPost, '[data-id="author"]', post.author)

    const thumbnailPost = liPost.querySelector('[data-id="thumbnail"]')
    if (thumbnailPost) {
      thumbnailPost.src = post.imageUrl
      thumbnailPost.addEventListener('error', () => {
        thumbnailPost.src = 'https://placehold.jp/1368x400.png?text=DuyxTong'
      })
    }

    setTextContent(liPost, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)

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
