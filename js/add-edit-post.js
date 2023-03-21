import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

function removeUnusedValues(formValues) {
  if (!formValues) return
  const payload = { ...formValues }

  if (payload.imageSource === 'upload') {
    delete payload.imageUrl
  } else {
    delete payload.image
  }

  delete payload.imageSource
  //remove id if its value is undefined
  if (payload.id === undefined) delete payload.id

  return payload
}

function jsonToFormData(jsonObject) {
  const formData = new FormData()

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }

  return formData
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedValues(formValues)
    const formData = jsonToFormData(payload)
    console.log(formValues, payload)

    const isSubmit = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)

    toast.success('Save post successfully')

    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${isSubmit.id}`)
    }, 2000)
  } catch (error) {
    console.log('failed to save form', error)
    toast.error(`${error}`)
  }
}

;(async () => {
  try {
    const url = new URL(window.location)
    const params = url.searchParams.get('id')

    const defaultValues = Boolean(params)
      ? await postApi.getById(params)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        }

    initPostForm({
      postForm: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log('failed to fetch Post Form', error)
  }
})()
