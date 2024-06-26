'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import github_icon from '@/public/assets/github_icon.svg'
import UserDefault from '@/public/assets/defaultUser.jpg'

type UserCardProps = {
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    github: string
    role: string
    password: string
    fk_imagesid_images: number
    gets_assigned: number[]
    applies: number[]
    issueId: number
    type: string
  }
  onAssign: (user_id: number, issue_id: number) => void
  onRemove: (user_id: number, issue_id: number) => void
  onCompleted: (user_id: number, issue_id: number) => void
  project_id: number
  searchQuery: string
}
interface Issue {
  id: number
  title: string
  description: string
  fk_projectsid: number
  visibility: string
  status: string
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onAssign,
  onRemove,
  onCompleted,
  project_id,
  searchQuery,
}) => {
  const {
    id,
    first_name,
    last_name,
    fk_imagesid_images: image_id,
    issueId,
    type,
  } = user
  const fullName = `${first_name} ${last_name}`
  const profileUrl = `/profile/${user.id}`
  const [issue, setIssue] = useState({} as Issue)
  const [image, setImage] = useState({} as string)

  useEffect(() => {
    fetch(`/api/project/${project_id}/issues/${issueId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setIssue(data)
      })
      .catch((error) => {
        console.log('Error fetching issue:', error.message)
        setIssue({} as Issue)
      })

    if (image_id) {
      fetch(`/api/image/${image_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          if (data && data.image) {
            const imageData = data.image.data
            const base64String = Buffer.from(imageData).toString('base64')
            setImage(`data:image/png;base64,${base64String}`)
          }
        })
        .catch((error) => {
          console.log('Error fetching image:', error.message)
          setImage('')
        })
    } else {
      console.log('No image_id', id);
    }
  }, [image_id])

  if (
    !fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !issue.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    console.log('No match');
  }

  if (!issue || Object.keys(issue).length === 0) return null

  if (!fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !issue.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
    return null;
  }

  return (
    <div className="flex-grow px-4 py-2 mt-2 w-full rounded-xl border-2 border-gray-100 bg-white">
      <div className="flex items-center justify-between">
        <Link href={`/profile/${user.id}`} legacyBehavior>
          <div className="flex items-center space-x-4 shrink-0 hover:bg-green-100 rounded-lg pr-1">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {image.length ? (
                <img
                  alt={fullName}
                  width={100}
                  height={100}
                  className="rounded-full"
                  src={image}
                />
              ) : (
                <img
                  alt={fullName}
                  width={100}
                  height={100}
                  className="rounded-full"
                  src={UserDefault.src}
                />
              )}
            </div>
            <div className="flex flex-col">
              <Link
                href={profileUrl}
                className="font-semibold text-lg hover:bg-green-100 rounded-lg px-1"
              >
                {fullName}
              </Link>
            </div>
          </div>
        </Link>
        <div className="flex items-center overflow-y-auto ">
          <Link href={`/project/${project_id}/issue/${issueId}`}>
            <span className="text-gray-700 hover:underline font-italic flex-col flex-wrap">
              {issue.title}
            </span>
          </Link>
          {type === 'applied' && issue.status === 'open' ? (
            <button
              onClick={() => onAssign(id, issueId)}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Priskirti
            </button>
          ) : (
            issue.status === 'open' && (
              <>
                <button
                  onClick={() => onCompleted(id, issueId)}
                  className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 mr-2 rounded-md"
                >
                  Atliko pataisymą
                </button>
                <button
                  onClick={() => onRemove(id, issueId)}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Pašalinti
                </button>
              </>
            )
          )}
          {issue.status === 'closed' && <div>This shouldnt happen</div>}
        </div>
      </div>
    </div>
  )
}

export default UserCard
