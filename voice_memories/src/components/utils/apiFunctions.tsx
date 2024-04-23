const baseUrl = 'https://7tpxtqwxq2.execute-api.us-west-2.amazonaws.com/dev/'

interface ImgData {
  email?: string
  album?: string
  imgType?: string
  title?: string
  audioType?: string
  imgId?: string
  position?: number
}

interface AuthTokens {
  access: string
  id: string
}

/**
 * @param email The email of the user.
 * @returns a Json object that contains the URLs of every photo a user has, organized by album.
 */

export const getAllUrls = async (email: string, tokens: AuthTokens) => {
  const res = await fetch(baseUrl + email, {
    headers: {
      'Access-Token': tokens.access,
      Authorization: tokens.id,
    },
  })
  const data = await res.json()

  return data
}

export const getAllSharedUrls = async (id: string) => {
  const res = await fetch(baseUrl + 'shared/' + id, {})

  console.log(res.ok)
  if (res.ok) {
    return await res.json()
  } else {
    throw 404
  }
}

/**
 * @param email The email of the user.
 * @param album The album of the user.
 * @returns a Json object that contains the URLs of every photo a user has, organized by album.
 */

export const getAlbumUrls = async (
  email: string,
  album: string,
  tokens: AuthTokens,
) => {
  const res = await fetch(baseUrl + email + album, {
    headers: {
      'Access-Token': tokens.access,
      Authorization: tokens.id,
    },
  })
  const data = await res.json()

  return data
}

/**
 * @param url The URL of a single photo
 * @returns An object containing both the image and audio files associated with a photo.
 */
export const getPhoto = async (url: string, tokens: AuthTokens) => {
  const res = await fetch(url, {
    headers: {
      'access-token': tokens.access,
      Authorization: tokens.id,
    },
  })

  const data = await res.json()
  const img = data.photo
  const audioFull = data.audio

  let audioBase64only = ''

  if (audioFull) {
    const index = audioFull.indexOf(',') + 1
    audioBase64only = audioFull.substring(index)
  }

  return {
    image: img,
    audio: audioBase64only,
    position: data.position,
  }
}

/**
 * Generates and returns a shareable link to an album.
 * @param email The user's email.
 * @param album The name of the album.
 * @param tokens The authorization tokens.
 *
 * @returns a shareable link to give the user
 */
export const createShareableLink = async (
  email: string,
  album: string,
  tokens: AuthTokens,
) => {
  const res = await fetch(baseUrl + email + '/' + album, {
    headers: {
      'access-token': tokens.access,
      Authorization: tokens.id,
    },
  })
  const data = await res.json()

  return data['Shared Url']
}

/**
 * Posts a photo to the server.
 *
 * @param imgData Contains information about the photo. See ImgData interface.
 * @param img The image file.
 * @param audio The audio file associated with the image.
 * @returns The URL of the newly uploaded photo.
 */
export const postPhoto = async (
  imgData: ImgData,
  tokens: AuthTokens,
  img: File,
  audio?: File,
) => {
  var imgBase64 = await fileToBase64(img)
  var audioBase64 = await fileToBase64(audio)

  var body = JSON.stringify(
    {
      'photo type': imgData.imgType,
      'audio type': imgData.audioType,
      'photo title': imgData.title,
      position: imgData.position,
      photo: imgBase64,
      audio: audioBase64,
    },
    (key, value) => {
      if (value != null) {
        return value
      }
    },
  )

  const res = await fetch(baseUrl + imgData.email + '/' + imgData.album, {
    method: 'POST',
    headers: {
      'Access-Token': tokens.access,
      Authorization: tokens.id,
    },
    body: body,
  })

  return await res.json()
}

/**
 * Updates the info of an existing photo.
 *
 * @param url The URL of the photo to update.
 * @param imgData Contains information about the photo. See ImgData interface.
 * @param img The new image file to update.
 * @param audio The new audio file to update.
 * @returns A json object with the location of the updated photo, as well as a summary of updated fields.
 */
export const updatePhoto = async (
  url: string,
  imgData: ImgData,
  tokens: AuthTokens,
  img?: File,
  audio?: File,
) => {
  var imgBase64 = await fileToBase64(img)
  var audioBase64 = await fileToBase64(audio)

  var body = JSON.stringify(
    {
      'photo type': imgData.imgType,
      'audio type': imgData.audioType,
      'photo title': imgData.title,
      album: imgData.album,
      photo: imgBase64,
      audio: audioBase64,
      position: imgData.position,
    },
    (key, value) => {
      if (value != null) {
        return value
      }
    },
  )

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Access-Token': tokens.access,
      Authorization: tokens.id,
    },
    body: body,
  })

  const data = await res.json()
  console.log(`Data: ${data}`)
  return data
}

export const deletePhoto = async (url: string, tokens: AuthTokens) => {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Access-Token': tokens.access,
      Authorization: tokens.id,
    },
  })

  const data = await res.json()
  return data
}

export const deleteAllPhotos = async (email: string, tokens: AuthTokens) => {
  const res = await fetch(baseUrl + email, {
    method: 'DELETE',
    headers: {
      'Access-Token': tokens.access,
      Authorization: tokens.id,
    },
  })

  return res.status
}

/**
 * @param file The file to be converted to base64.
 * @returns a base64 string representation of the file.
 */
function fileToBase64(file?: File) {
  if (file === undefined) {
    return null
  }

  return new Promise((resolve: any, reject: any) => {
    const reader = new FileReader()
    reader.readAsDataURL(file as File)
    reader.onload = () => {
      var base64 = reader.result as string

      if (base64 != null) {
        base64 = base64.substring(base64.indexOf(',') + 1)
      }

      resolve(base64)
    }
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

/**
 * Converts a base64 string into an audio file.
 * @TODO Add support for other types of audio files besides mp3.
 *
 * @param base64 A base64 string.
 * @returns An audio file.
 */
function base64ToAudio(base64: string) {
  const binary = atob(base64)
  const binaryArray = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    binaryArray[i] = binary.charCodeAt(i)
  }

  const url = URL.createObjectURL(
    new Blob([binaryArray], { type: 'audio/mpeg' }),
  )
  // const audio = new Audio()
  //audio.src = url

  return url
}

/**
 * Converts a base64 string into an image file.
 * @TODO Add support for other types of image files besides jpg.
 *
 * @param base64 A base64 string.
 * @returns An image file.
 */
export function base64ToImage(base64: string) {
  const binary = atob(base64)
  const binaryArray = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    binaryArray[i] = binary.charCodeAt(i)
  }

  const url = URL.createObjectURL(
    new Blob([binaryArray], { type: 'image/jpeg' }),
  )

  return url
}
