'use client';

import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, Flag } from "lucide-react";
import { baseAPI } from "../../../config/api";
import { formatCountryName } from "../../../utils/formatName";
import EditModal from "./components/EditModal";
import CountryFlag from "../../../components/ui/CountryFlag";
import DeleteModal from "../../../components/ui/DeleteModal";
import toast from 'react-hot-toast';

const CountryPage = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [modalMode, setModalMode] = useState('edit');

  useEffect(() => {
    fetchCountries();
  }, [searchTerm, page]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await baseAPI.course.getCountries({ search: searchTerm, page, limit: 10 });
      setCountries(Array.isArray(response.data?.data) ? response.data.data : []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
      setTotalCount(response.data?.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (country) => {
    setSelectedCountry(country);
    setModalMode('edit');
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCountry(null);
    setModalMode('create');
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    await fetchCountries();
  };

  const handleDelete = (country) => {
    setSelectedCountry(country);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await baseAPI.course.deleteCountry(selectedCountry._id);
      if (response.success) {
        toast.success(response.message || 'Country deleted successfully!');
        setPage(1);
        await fetchCountries();
      } else {
        toast.error(response.message || 'Failed to delete country');
      }
    } catch (error) {
      console.error('Error deleting country:', error);
      toast.error(error.message || 'Failed to delete country');
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedCountry(null);
    }
  };

return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Country Management</h2>
          <p className="text-sm text-gray-600 mt-1">View and manage all countries</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Add Country
        </button>
      </div>

      <div className="relative w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search countries..."
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
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SL No
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flag
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-4 sm:px-6 py-4 text-center text-gray-500">
                    Loading countries...
                  </td>
                </tr>
              ) : countries.length > 0 ? (
                countries.map((country, index) => (
                  <tr key={country._id || index} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 text-sm">{(page - 1) * 10 + index + 1}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <CountryFlag country={country} className="w-10 h-7" />
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 capitalize text-sm">
                        {formatCountryName(country.name) || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3 sm:space-x-6">
                        <button
                          onClick={() => handleEdit(country)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(country)}
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
                  <td colSpan="4" className="px-4 sm:px-6 py-4 text-center text-gray-500">
                    No countries found
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
            Showing {countries.length > 0 ? (page - 1) * 10 + 1 : 0} to {(page - 1) * 10 + countries.length} of {totalCount} countries
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
        country={selectedCountry}
        onSave={handleSave}
        mode={modalMode}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Country"
        message={`Are you sure you want to delete ${selectedCountry?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default CountryPage;