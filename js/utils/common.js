export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength)}...`
}

export function setFielValue(form, selector, value) {
  const field = form.querySelector(selector)
  if (field) field.value = value
}

export function setBackgroundImg(parent, selector, imgUrl) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.style.backgroundImage = `url("${imgUrl}")`
}

export function randomNumber(number) {
  if (number <= 0) return -1

  const random = Math.random() * number
  return Math.floor(random)
}
