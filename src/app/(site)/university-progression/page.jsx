import Course from '@/views/Courses';
import { BASE_URL } from '@/config/api';

export const metadata = {
  title: 'University Progression',
  description:
    'Search progression routes from Veritas Pathways programmes to partner universities in the UK and beyond, with the entry requirements for each course.',
};

// Rebuilt in the background at most every five minutes, so a data import
// shows up without a redeploy while visitors still get a cached page.
export const revalidate = 300;

const PAGE_SIZE = 10;

// A failed request falls back to the client fetching on its own, so an API
// hiccup at build or revalidation time never breaks the page.
const fetchJson = async (path) => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, { next: { revalidate } });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

export default async function UniversityProgressionPage() {
  const [courses, universities, programmes] = await Promise.all([
    fetchJson(`/course?page=1&limit=${PAGE_SIZE}&group=true`),
    fetchJson('/course/university?limit=1000'),
    fetchJson('/course/programme'),
  ]);

  return (
    <Course
      initialCourses={Array.isArray(courses?.data?.data) ? courses.data.data : null}
      initialPagination={courses?.data?.pagination ?? null}
      initialUniversities={Array.isArray(universities?.data?.data) ? universities.data.data : null}
      initialProgrammes={Array.isArray(programmes?.data) ? programmes.data : null}
    />
  );
}
