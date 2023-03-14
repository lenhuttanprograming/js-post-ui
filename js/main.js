import postApi from './api/postApi'

async function main() {
  //   const response = await axiosClient.get('/posts')

  try {
    const params = {
      _page: 1,
      _limit: 3,
    }
    const responsePosts = await postApi.getAll(params)

    //  const responseStudents = await studentApi.getAll(params)

    console.log('main.js data', responsePosts)
    //  console.log(responseStudents)
  } catch (error) {
    console.log('getAll failed', error)
  }

  const data = {
    id: 'lea2aa9l7x3a5tg',
    title: 'Iure aperiam unde 666',
  }

  await postApi.getById(data.id)
}

main()
