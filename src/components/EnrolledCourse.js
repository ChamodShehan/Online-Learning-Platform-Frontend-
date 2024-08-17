import React, { useEffect, useState } from 'react';
import { getEnrolledCourses, getTaughtCourses } from '../services/api';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const EnrolledCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let response;
        let userId;

        if (token) {
          const decodedToken = jwtDecode(token);

          userId = decodedToken.id || decodedToken.userId || decodedToken.sub;

        } else {
          throw new Error('No token found');
        }

        if (userRole === 'student') {
          response = await getEnrolledCourses(token, userId);
        } else if (userRole === 'instructor') {
          response = await getTaughtCourses(token, userId);
        } else {
          throw new Error('Invalid role');
        }

        setCourses(response.data);
      } catch (err) {
        setError(`Failed to load courses: ${err.message}`);
        toast.error('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userRole, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (courses.length === 0) {
    return <div>No courses found.</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>
        {userRole === 'student' ? 'Enrolled Courses' : 'Taught Courses'}
      </h2>
      <ul className='space-y-4'>
        {courses.map((course) => (
          <li key={course._id} className='bg-white p-4 shadow-md rounded-lg'>
            <h3 className='text-xl font-bold'>{course.title}</h3>
            <p className='text-gray-600'>{course.description}</p>
            <p className='text-sm text-gray-500'>
              Instructor: {course.instructor.username}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnrolledCourse;
