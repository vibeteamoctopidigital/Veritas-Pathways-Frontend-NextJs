'use client';

import { useCallback, useEffect, useState } from "react";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { baseAPI } from "../../../config/api";
import { formatCountryName } from "../../../utils/formatName";
import DeleteModal from "../../../components/ui/DeleteModal";
import EditModal from "./components/EditModal";

const PAGE_SIZE = 10;

// One entry per course, the way the website shows them: rows for the same
// course (one per programme) come back grouped, with every row in `programmes`.
const fetchCoursePage = (search, page) =>
  baseAPI.course.getAllCourse({ search, page, limit: PAGE_SIZE, group: true }).catch(() => null);

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [editor, setEditor] = useState(null); // { mode: 'create' | 'edit', course }
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const applyResponse = useCallback((response) => {
    if (response?.success) {
      setCourses(Array.isArray(response.data?.data) ? response.data.data : []);
      setPagination(response.data?.pagination ?? { total: 0, totalPages: 1 });
    } else {
      setCourses([]);
      toast.error(response?.message || "Could not load courses");
    }
    setLoading(false);
  }, []);

  const reload = useCallback(
    () => fetchCoursePage(searchTerm, page).then(applyResponse),
    [searchTerm, page, applyResponse],
  );

  useEffect(() => {
    let cancelled = false;
    fetchCoursePage(searchTerm, page).then((response) => {
      if (!cancelled) applyResponse(response);
    });
    return () => {
      cancelled = true;
    };
  }, [searchTerm, page, applyResponse]);

  // Deleting a course removes every programme row that belongs to it.
  const confirmDelete = async () => {
    setDeleting(true);
    const rows = toDelete.programmes?.length ? toDelete.programmes : [toDelete];
    const results = await Promise.all(rows.map((row) => baseAPI.course.deleteCourse(row._id).catch(() => null)));
    setDeleting(false);
    setToDelete(null);
    const failed = results.filter((r) => !r?.success);
    if (failed.length === 0) {
      toast.success("Course deleted");
    } else {
      toast.error(failed[0]?.message || "Could not delete the course");
    }
    reload();
  };

  const rowsIn = (course) => (course.programmes?.length ? course.programmes : [course]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Each course lists the programmes that lead to it, as shown on the website
          </p>
        </div>
        <button
          onClick={() => setEditor({ mode: "create", course: null })}
          className="flex items-center gap-2 px-4 py-2 bg-[#22B2A8] text-white rounded-md hover:bg-[#1a9d8f] transition whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Add course
        </button>
      </div>

      <div className="relative w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by subject, degree or course code..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22B2A8] focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Course", "University", "Programmes", "Entry", "Status", "Actions"].map((heading, i) => (
                  <th
                    key={heading}
                    className={`px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${i === 3 ? "hidden lg:table-cell" : ""}`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-500">Loading courses...</td>
                </tr>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50 align-top">
                    <td className="px-4 sm:px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {course.subject || "Untitled"}
                        {course.degree && <span className="ml-1.5 text-gray-500 font-normal">{course.degree}</span>}
                      </p>
                      {course.courseCode && <p className="text-xs text-gray-400 mt-0.5">{course.courseCode}</p>}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <p className="text-sm text-gray-900 capitalize">{course.university?.name || "N/A"}</p>
                      <p className="text-xs text-gray-500">{formatCountryName(course.university?.country?.name) || ""}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-sm">
                        {rowsIn(course).map((row) => (
                          <span
                            key={row._id}
                            className="inline-flex px-2 py-0.5 rounded-full bg-[#22B2A8]/10 text-[#158e88] text-xs font-medium"
                          >
                            {row.programType || "Direct entry"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                      {course.version || course.intakeYear || "N/A"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.isActive ? "bg-primary-100 text-primary-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {course.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditor({ mode: "edit", course })}
                          title="Edit course"
                          aria-label={`Edit ${course.subject}`}
                          className="p-2 rounded-md text-[#158e88] hover:bg-[#22B2A8]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setToDelete(course)}
                          title="Delete course"
                          aria-label={`Delete ${course.subject}`}
                          className="p-2 rounded-md text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-500">No courses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && pagination.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * PAGE_SIZE + 1} to {(page - 1) * PAGE_SIZE + courses.length} of{" "}
            {pagination.total.toLocaleString("en-GB")} courses
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-md bg-white disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 border rounded-md bg-gray-50">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="px-3 py-1 border rounded-md bg-white disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {editor && (
        <EditModal
          key={editor.course?._id ?? "new"}
          mode={editor.mode}
          course={editor.course}
          onClose={() => setEditor(null)}
          onSave={reload}
        />
      )}

      <DeleteModal
        isOpen={Boolean(toDelete)}
        onClose={() => !deleting && setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete course"
        message={
          toDelete
            ? `Delete ${toDelete.subject}${toDelete.degree ? ` ${toDelete.degree}` : ""} at ${toDelete.university?.name ?? "this university"}? ${
                rowsIn(toDelete).length > 1 ? `All ${rowsIn(toDelete).length} programmes for this course will be removed. ` : ""
              }This cannot be undone.`
            : ""
        }
      />
    </div>
  );
};

export default CoursePage;
