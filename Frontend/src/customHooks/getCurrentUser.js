import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const getCurrentUser = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getcurrentuser", {
          withCredentials: true
        })
        dispatch(setUserData(result.data))
      } catch (error) {
        // Status 401/400 simply means the visitor is not logged in (guest)
        if (error.response?.status === 401 || error.response?.status === 400) {
          localStorage.removeItem("token")
        } else {
          console.error("GetCurrentUser error:", error)
        }
        dispatch(setUserData(null))
      }
    }
    fetchUser()
  }, [dispatch])
}

export default getCurrentUser