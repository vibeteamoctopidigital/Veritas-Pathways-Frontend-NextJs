'use client';

import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, BookOpen } from "lucide-react";
import { baseAPI } from "../../../config/api";
import { formatCountryName } from "../../../utils/formatName";
import EditModal from "./components/EditModal";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalMode, setModalMode] = useState('edit');

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await baseAPI.course.getAllCourse({ search: searchTerm, page, limit: 10 });
      setCourses(Array.isArray(response.data?.data) ? response.data.data : []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
      setTotalCount(response.data?.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setModalMode('edit');
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCourse(null);
    setModalMode('create');
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      // Add delete API call when available
      console.log('Delete course:', id);
      await fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-sm text-gray-600 mt-1">View and manage all courses</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL No</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">IFY Points</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">IFY Grades</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">EAP Overall</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Notes</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-4 sm:px-6 py-4 text-center text-gray-500">
                    Loading courses...
                  </td>
                </tr>
              ) : courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr key={course._id || index} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 text-sm">{course.sl || (page - 1) * 10 + index + 1}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 capitalize text-sm">
                        {course.university?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                        {formatCountryName(course.university?.country?.name) || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-gray-900 text-sm">{course.subject || 'N/A'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-gray-900 text-sm">{course.ifyPointsRequired || 'N/A'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-gray-900 text-sm">{course.ifyGradesRequired || 'N/A'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                      <div className="text-gray-900 text-sm">{course.eap?.overall || 'N/A'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden xl:table-cell">
                      <div className="text-gray-600 text-sm max-w-xs truncate" title={course.notes}>
                        {course.notes || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.isActive ? 'bg-primary-100 text-primary-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3 sm:space-x-6">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-primary hover:text-primary-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-4 sm:px-6 py-4 text-center text-gray-500">
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {courses.length > 0 ? (page - 1) * 10 + 1 : 0} to {(page - 1) * 10 + courses.length} of {totalCount} courses
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 border rounded-md bg-gray-50">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        course={selectedCourse}
        onSave={fetchCourses}
        mode={modalMode}
      />
    </div>
  );
};

export default CoursePage;