import { setBackgroundImg, setFielValue, setTextContent, randomNumber } from './common'
import * as yup from 'yup'

const sourceValues = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),

    imageSource: yup
      .string()
      .required('Please choose image source option!')
      .oneOf([sourceValues.PICSUM, sourceValues.UPLOAD], 'Please choose correct source'),

    imageUrl: yup.string().when('imageSource', {
      is: sourceValues.PICSUM,
      then: (schema) =>
        schema.required('Please random background image').url('Please enter an valid url'),
    }),

    image: yup.mixed().when('imageSource', {
      is: sourceValues.UPLOAD,
      then: (schema) =>
        schema
          .test('required', 'Please upload background image', (file) => Boolean(file.name))
          .test('max-3mb', 'The image is too large (max 3MB)', (file) => {
            const fileSize = file.size
            const MAX_SIZE = 1024 * 1024 * 3

            return fileSize <= MAX_SIZE
          }),
    }),
  })
}

function setFieldError(form, name, error) {
  console.log(error)
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validatePostForm(form, formValues) {
  form.classList.remove('was-validated')
  try {
    // reset previous error
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))

    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError' || Array.isArray(error.inner))
      for (let validationError of error.inner) {
        const name = validationError.path

        // check if error log
        if (errorLog[name]) continue

        // set field error and mark as logged
        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

async function validatePostField(form, formValues, name) {
  try {
    setFieldError(form, name, '')
    const schema = getPostSchema()
    await schema.validateAt(name, formValues)
  } catch (error) {
    setFieldError(form, name, error.message)
  }

  const field = form.querySelector(`[name="${name}"]`)
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated')
  }
}

function setFormValues(form, value) {
  setFielValue(form, '[name="title"]', value.title)
  setFielValue(form, '[name="author"]', value.author)
  setFielValue(form, '[name="description"]', value.description)

  setFielValue(form, '[name="imageUrl"]', value.imageUrl)
  setBackgroundImg(document, '#postHeroImage', value.imageUrl)
}

function getFormValues(form) {
  const formValues = {}
  const data = new FormData(form)
  for (let [name, value] of data) {
    formValues[name] = value
  }

  return formValues
}

function showLoading(form) {
  const loading = form.querySelector('#loading')
  if (loading) {
    loading.classList.add('disabled')
    loading.textContent = 'Saving...'
  }
}

function hideLoading(form) {
  const loading = form.querySelector('#loading')
  if (loading) {
    loading.classList.remove('disabled')
    loading.textContent = 'Save'
  }
}

function initImageChange(form) {
  const postImageRandom = document.getElementById('postChangeImage')
  if (!postImageRandom) return

  postImageRandom.addEventListener('click', () => {
    const newUrl = `https://picsum.photos/id/${randomNumber(1000)}/1378/400`

    setBackgroundImg(document, `#postHeroImage`, newUrl)
    setFielValue(form, '[name="imageUrl"]', newUrl)
  })
}

function showOptionImageSource(form, selectedOption) {
  const imageSourceList = form.querySelectorAll('[data-id="imageSource"]')
  if (imageSourceList) {
    imageSourceList.forEach((source) => {
      // source.hidden = source.dataset.imageSource !== selectedOption
      source.hidden = source.getAttribute('data-image-source') !== selectedOption
    })
  }
}

function initImageSource(form) {
  const optionList = form.querySelectorAll('[name="imageSource"]')
  if (optionList) {
    optionList.forEach((option) => {
      option.addEventListener('change', (event) => {
        showOptionImageSource(form, event.target.value)
      })
    })
  }
}

function initUploadImage(form) {
  const element = form.querySelector('[name="image"]')
  if (element) {
    element.addEventListener('change', (event) => {
      const imageUrl = URL.createObjectURL(element.files[0])

      setBackgroundImg(document, '#postHeroImage', imageUrl)
      validatePostField(
        form,
        {
          imageSource: sourceValues.UPLOAD,
          image: element.files[0],
        },
        'image'
      )
    })
  }
}

function initInputChange(form) {
  ;['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name=${name}]`)
    if (field) {
      field.addEventListener('input', (event) => {
        validatePostField(
          form,
          {
            [name]: event.target.value,
          },
          name
        )
      })
    }
  })
}

export async function initPostForm({ postForm, defaultValues, onSubmit }) {
  const form = document.getElementById(postForm)
  if (!form) return

  setFormValues(form, defaultValues)
  initImageChange(form)
  initImageSource(form)
  initUploadImage(form)
  initInputChange(form)

  let isLoading = false

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (isLoading) return

    //get form values
    const formValues = getFormValues(form)
    formValues.id = defaultValues.id

    // validation
    const isValid = await validatePostForm(form, formValues)
    if (!isValid) return
    isLoading = true
    showLoading(form)

    await onSubmit(formValues)

    // if valid ->  trigger callback function

    // otherwise, show validation error
    hideLoading(form)
    isLoading = false
  })
}
