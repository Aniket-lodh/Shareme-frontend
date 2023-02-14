import {useState, useEffect, useRef} from 'react'
import {MdDownloadForOffline} from 'react-icons/md'
import {Link, useParams} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {client} from '../utils/client.js'
import MasonryLayout from './MasonryLayout.jsx'
import {pinDetailMorePinQuery, pinDetailQuery} from '../utils/data'
import Spinner, {Loader} from './Spinner.jsx'
import CommentsList from './commentsList.jsx'

const PinDetails = ({user}) => {
  const [pins, setPins] = useState([])
  const [pinDetails, setPinDetails] = useState(null)
  const [addingComment, setAddingComment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isHoveringComment, setIsHoveringComment] = useState(false)
  const [isSettingActive, setIsSettingActive] = useState(false)

  const {pinId} = useParams()
  const commentRef = useRef(null)


  const fetchPinDetails = async () => {
    let query = pinDetailQuery(pinId)

    if (query) {
      await client.fetch(query).then((data) => {
        setPinDetails(data[0])

        //fetching related pins
        if (data[0]) {
          query = pinDetailMorePinQuery(data[0])
          client.fetch(query).then((data) => {
            setPins(data)
          })
        }
      })
    }
  }

  const addComment = async () => {
    if (commentRef.current.value !== undefined && commentRef.current.value !== '' && commentRef.current.value !== null) {
      setAddingComment(true)
      await client
        .patch(pinId)
        .setIfMissing({comments: []})
        .insert('after', 'comments[-1]', [
          {
            comment: commentRef.current.value,
            _key: `${uuidv4()}`,
            postedBy: {
              _type: 'reference',
              _ref: user._id
            }
          }
        ])
        .commit()
        .then(() => {
          setIsLoadingComments(true)
          commentRef.current.value = null

          fetchPinDetails().then(() => {
            setAddingComment(false)
            setIsLoadingComments(false)
          })
        })
    } else setAddingComment(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await fetchPinDetails()
    }
    fetchData().then(() => {
      setIsLoading(false)
    })

  }, [pinId])

  if (isLoading) return <Spinner message='Loading details' />

  return (
    <>
      <div
        className=' flex xl:flex-row flex-col m-auto bg-white shadow-md min-h-350 h-fit'
        style={{maxWidth: '1000px', borderRadius: '32px'}}
      >
        <div className='flex items-center justify-center md:items-start flex-initial p-2'>
          <img
            src={pinDetails?.image.asset && pinDetails?.image.asset.url}
            alt='user-image'
            className='rounded-t-3xl rounded-b-lg'
          />
        </div>

        <div className='p-5 h-fit flex-1 xl:min-w-470'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <a
                href={
                  pinDetails?.image.asset &&
                  `${pinDetails?.image.asset.url}?dl=`
                }
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={pinDetails?.destination}
              target='blank'
              referrerPolicy='no-referrer'
            >
              {pinDetails?.destination.length > 20
                ? pinDetails?.destination.slice(8, 33)
                : pinDetails?.destination}
            </a>
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3'>
              {pinDetails?.title}
            </h1>
            <p className='mt-3'>{pinDetails?.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetails?.postedBy?._id}`}
            className='flex gap-2 mt-2 items-center bg-white rounded-lg'
          >
            <img
              referrerPolicy='no-referrer'
              src={pinDetails?.postedBy?.image}
              alt='pin-creator'
              className='w-8 h-8 rounded-full object-cover'
            />
            <p className='font-medium capitalize'>
              {pinDetails?.postedBy?.name}
            </p>
          </Link>
          <details>
            <summary className='mt-5 text-2xl mb-2 cursor-pointer '>{pinDetails?.comments ? pinDetails?.comments.length : '0'} Comments</summary>
            <div className='max-h-370 overflow-y-auto scrollbar-hidden p-3'>
              {isLoadingComments && <Spinner message={'loading comments...'} />}

              {!isLoadingComments &&
                pinDetails?.comments &&
                pinDetails?.comments.map((comment, index) => (

                  <div key={index}>
                    <CommentsList comment={comment} index={index} user={user} />
                  </div>
                ))}
              {!isLoadingComments && !pinDetails?.comments && (
                <div className='flex w-full items-center justify-center mt-6'>
                  <p className='text-xl font-medium'>No Comments</p>
                </div>
              )}
            </div>
          </details>

          <div className='sticky bg-white -bottom-2 pb-2 pt-3 border-t-2 flex gap-3 items-center justify-center'>
            <Link to={`/user-profile/${user?._id}`}>
              <img
                referrerPolicy='no-referrer'
                src={user?.image}
                alt='user-profile'
                className='w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer'
              />
            </Link>
            <input
              type='text'
              className='w-3/5 flex-auto border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
              placeholder='Add a comment'
              ref={commentRef}
              onKeyDown={(e) => {
                if (e.code === 'Enter')
                  addComment()
              }}
            />
            <button
              type='button'
              className='w-1/5 md:w-auto flex-initial bg-red-500 text-white rounded-full px-3 py-2 font-semibold text-base outline-none'
              onClick={addComment}
            >
              {addingComment ? <Loader /> : 'post'}
            </button>
          </div>
        </div>
      </div>


      {pins?.length > 0 && (
        <>
          <h2 className='text-center font-bold text-2xl mb-8 mt-6'>
            More Like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      )}
    </>
  )
}

export default PinDetails
