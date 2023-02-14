import {useState} from 'react'
import {AiOutlineCloudUpload} from 'react-icons/ai'
import {MdDelete} from 'react-icons/md'
import {useNavigate} from 'react-router-dom'

import {client} from '../utils/client.js'
import {categories} from '../utils/data.js'
import Spinner from './Spinner.jsx'

const CreatePin = ({user}) => {
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(false)
  const [category, setCategory] = useState(null)
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)

  const navigate = useNavigate()
  const uploadImage = (e) => {
    setLoading(true)
    const {type, name} = e.target.files[0]

    if (type === 'image/png' || type === 'image/svg' || type === 'image/jpg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff') {
      setWrongImageType(false)
      client.assets
        .upload('image', e.target.files[0], {contentType: type, filename: name})
        .then(doc => {
          setImageAsset(doc)
          setLoading(false)
        })
        .catch(err => console.error(`Error Uploading file: ` + err))
    } else {
      setLoading(false)
      setWrongImageType(true)
    }
  }

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: 'pins',
        title,
        about,
        destination,
        category,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'reference',
          _ref: user._id
        }
      }
      client.create(doc)
        .then(() => {
          navigate('/')
        })
    } else {
      setFields(true)
      setTimeout(() => {
        setFields(false)
      }, 4000)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {
        fields && (
          <p className='text-xl transition-all ease-in mb-5 text-red-500'>
            Please fill in all the fields
          </p>
        )
      }
      <div className='flex lg:flex-row flex-col justify-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {wrongImageType && <p>Wrong Image format</p>}
            {!imageAsset ? (
              <label htmlFor='upload-image'>
                <div className='flex flex-col justify-center items-center h-full cursor-pointer'>
                  <div className='flex flex-col justify-center items-center'>
                    {loading ? <Spinner /> : (
                      <>
                        <p className='font-bold text-2xl'>
                          <AiOutlineCloudUpload />
                        </p>
                        <p className='text-md'>Click to upload</p></>
                    )}
                  </div>
                  <p className='mt-5 text-gray-400 text-center'>
                    Use high quality JPG, SVG, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                <input type='file' id='upload-image' name='upload-image'
                       className='w-0 h-0'
                       onChange={uploadImage} />
              </label>
            ) : (
              <div className='relative h-full'>
                <img referrerPolicy='no-referrer' src={imageAsset.url} alt='image-asset-url' className='h-full w-full' />
                <button type='button'
                        className='absolute bottom-3 right-3 p-3 rounder-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all ease-in-out '
                        onClick={() => setImageAsset(null)}>
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input type='text' value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder='Add your title'
                 className='outline-none text-xl sm:text-2xl font-bold border-b-2 border-gray-200 p-2'
          />
          {user && (
            <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
              <img referrerPolicy='no-referrer' src={user?.image} alt='user-image' className='w-10 h-10 rounded-full' />
              <p className='font-bold'>{user.name}</p>
            </div>
          )}
          <input type='text' value={about}
                 onChange={(e) => setAbout(e.target.value)}
                 placeholder='What is your pin about'
                 className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          />
          <input type='text' value={destination}
                 onChange={(e) => setDestination(e.target.value)}
                 placeholder='Add a destination link'
                 className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          />
          <div className='flex flex-col '>
            <p className='mb-2 font-semibold sm:text-lg text-xl'>Choose pin category</p>
            <select name='category-select' id='category-select'
                    defaultValue='other'
                    onClick={(e) => setCategory(e.target.value)}
                    className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'>
              <option value='other' className='bg-white'>Select category</option>
              {categories.map((category, index) => (
                <option
                  key={index}
                  className='text-base border-0 outline-none capitalize bg-white text-black'
                  value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className='flex justify-end items-end'>
            <button type='button'
                    onClick={savePin}
                    className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
            >
              Save Pin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin