import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'

const getCreatorCourseData = () => {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)

  return (
    useEffect(() => {
      // Only fetch if the logged-in user is an educator — prevents intrusive errors for students
      if (userData?.role !== 'educator') return

      const getCreatorData = async () => {
        try {
          const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })
          await dispatch(setCreatorCourseData(result.data))
        } catch (error) {
          console.error("Failed to fetch creator courses:", error)
        }
      }
      getCreatorData()
    }, [userData])
  )
}

export default getCreatorCourseData
