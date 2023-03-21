function showModal(modal) {
  const myModal = new window.bootstrap.Modal(modal)
  if (myModal) myModal.show()
}

export function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  // handle click for all imgs -> event delegation
  // img click -> find the same number of imgs in the same album
  // determine index of img
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  if (modalElement.dataset.registered) return

  const imgElement = modalElement.querySelector(imgSelector)
  const prevElement = modalElement.querySelector(prevSelector)
  const nextElement = modalElement.querySelector(nextSelector)

  if (!imgElement || !prevElement || !nextElement) return

  let imgList = []
  let currentIndex = 0

  function showImage(index) {
    imgElement.src = imgList[index].src
  }

  document.addEventListener('click', (event) => {
    // console.log(event.target)
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === target)
    showImage(currentIndex)
    showModal(modalElement)
  })

  prevElement.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImage(currentIndex)
  })

  nextElement.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length
    showImage(currentIndex)
  })

  modalElement.dataset.registered = true
}
