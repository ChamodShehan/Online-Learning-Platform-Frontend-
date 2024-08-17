import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
});

API.interceptors.request.use((config) => {
  console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
  if (config.headers.Authorization) {
    console.log('Authorization Header:', config.headers.Authorization);
  }
  if (config.data) {
    console.log('Request Data:', config.data);
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

API.interceptors.response.use((response) => {
  console.log(`Response from ${response.config.url}:`, response.data);
  return response;
}, (error) => {
  console.error(`Error response from ${error.config.url}:`, error.response ? error.response.data : error.message);
  return Promise.reject(error);
});

export const fetchCourses = () => {
  console.log('Fetching all courses');
  return API.get('/courses');
};

export const fetchCourseById = (id) => {
  console.log(`Fetching course by ID: ${id}`);
  return API.get(`/courses/${id}`);
};

export const createCourse = (courseData, token) => {
  console.log('Creating a new course:', courseData);
  return API.post('/courses', courseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateCourse = (id, courseData, token) => {
  console.log(`Updating course ID: ${id} with data:`, courseData);
  return API.put(`/courses/${id}`, courseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteCourse = (id, token) => {
  console.log(`Deleting course ID: ${id}`);
  return API.delete(`/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const enrollInCourse = (id, token) => {
  console.log(`Enrolling in course ID: ${id}`);
  return API.post(`/courses/enroll/${id}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEnrolledCourses = (token,userId) => {
  console.log('Fetching enrolled courses for student');
  return API.get(`/courses/getEnrolledCourses/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTaughtCourses = (token,userId) => {
  console.log('Fetching taught courses for instructor');
  return API.get(`/courses/getTaughtCourses/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const loginUser = (userData) => {
  console.log('Logging in user:', userData);
  return API.post('/auth/login', userData);
};

export const signupUser = (userData) => {
  console.log('Signing up user:', userData);
  return API.post('/auth/register', userData);
};

export const getGPTRecommendations = (prompt, token) => {
  console.log('Fetching GPT recommendations with prompt:', prompt);
  return API.post(
    '/gpt/recommendations',
    { prompt },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export default API;
