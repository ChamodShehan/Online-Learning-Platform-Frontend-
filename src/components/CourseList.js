import React, { useState, useEffect } from 'react';
import { fetchCourses, deleteCourse, enrollInCourse } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role'); // Fetching user role from localStorage

  useEffect(() => {
    const getCourses = async () => {
      try {
        const { data } = await fetchCourses();
        setCourses(data || []); // Set an empty array if data is null or undefined
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]); // Fallback to empty array on error
      }
    };
    getCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      await deleteCourse(id, token);
      setCourses(courses.filter((course) => course._id !== id));
      toast.success('Course deleted successfully');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('You are not authorized to delete this course.');
      } else {
        toast.error('Failed to delete course. Please try again later.');
      }
      console.error('Error deleting course:', error);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/courses/update/${id}`);
  };

  const handleView = (id) => {
    navigate(`/courses/view/${id}`);
  };

  const handleCreate = () => {
    navigate('/courses/create');
  };

  const handleEnroll = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You need to be logged in to enroll in a course.');
        return;
      }
  
      await enrollInCourse(id, token);
      toast.success(`You have successfully enrolled!`);
    } catch (error) {
      toast.error('Failed to enroll in the course. Please try again later.');
      console.error('Error enrolling in course:', error);
    }
  };
  
  return (
    <div className='container mx-auto p-4'>
      <ToastContainer />
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold text-blue-500'>
          Explore Our Courses
        </h2>
        {userRole === 'instructor' && (
          <button
            onClick={handleCreate}
            className='bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md'
          >
            Create New Course
          </button>
        )}
      </div>

      {courses.length > 0 ? (
        <ul className='space-y-4'>
          {courses.map((course) => (
            <li
              key={course._id}
              className='bg-white p-4 shadow-md rounded-lg flex justify-between items-center'
            >
              <div>
                <h3 className='text-xl font-bold text-gray-800'>
                  {course.title}
                </h3>
                <p className='text-gray-600'>{course.description}</p>
                <p className='text-sm text-gray-500'>
                  Instructor: {course.instructor.username}
                </p>
              </div>
              <div className='space-x-2'>
                <button
                  onClick={() => handleView(course._id)}
                  className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md'
                >
                  View Details
                </button>
                {userRole === 'instructor' ? (
                  <>
                    <button
                      onClick={() => handleUpdate(course._id)}
                      className='bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded-md'
                    >
                      Edit Course
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className='bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md'
                    >
                      Delete Course
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEnroll(course._id)} // Pass courseId and courseTitle
                    className='bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md'
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-gray-600 text-center'>
          No courses available at the moment.
        </p>
      )}
    </div>
  );
};

export default CourseList;
