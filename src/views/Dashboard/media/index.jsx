'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Trash2, Upload, Copy, Check, Image as ImageIcon, FileText, HardDrive, Folder, FolderOpen, Layers } from "lucide-react";
import toast from "react-hot-toast";
import { baseAPI, MAX_UPLOAD_BATCH, resolveMediaUrl } from "../../../config/api";
import DeleteModal from "../../../components/ui/DeleteModal";
import { rules } from "../../../utils/validation";

const PAGE_SIZE = 24;

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
};

const TYPE_FILTERS = [
  { label: "All files", value: "" },
  { label: "Images", value: "image" },
];

const MediaPage = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [folders, setFolders] = useState([]);
  // '' = all files, '__none__' = files with no folder.
  const [activeFolder, setActiveFolder] = useState("");
  const [newFolder, setNewFolder] = useState({ open: false, name: "", error: "" });
  const fileInputRef = useRef(null);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const response = await baseAPI.upload.getAll({
        search: searchTerm,
        type: typeFilter,
        folder: activeFolder,
        page,
        limit: PAGE_SIZE,
      });
      setMedia(Array.isArray(response.data?.data) ? response.data.data : []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
      setTotalCount(response.data?.pagination?.total || 0);
      setTotalBytes(response.data?.totalBytes || 0);
      setFolders(Array.isArray(response.data?.folders) ? response.data.folders : []);
    } catch (error) {
      console.error("Error fetching media:", error);
      setMedia([]);
      toast.error("Could not load the media library");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, typeFilter, activeFolder, page]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (fileList) => {
    const files = Array.from(fileList || []).filter(Boolean);
    if (files.length === 0) return;

    if (files.length > MAX_UPLOAD_BATCH) {
      toast.error(`Up to ${MAX_UPLOAD_BATCH} files at a time`);
      return;
    }

    // Files land in the folder you are viewing; "All files" and "Uncategorised"
    // both mean no folder.
    const targetFolder = activeFolder === "__none__" ? "" : activeFolder;

    setUploading(true);
    try {
      // The single-file endpoint returns a cleaner error for the common case.
      const response = files.length === 1
        ? await baseAPI.upload.singleUpload(files[0], targetFolder)
        : await baseAPI.upload.multipleUpload(files, targetFolder);

      if (response?.success === false) {
        throw new Error(response.message || "Upload failed");
      }

      toast.success(`Uploaded ${files.length} file${files.length === 1 ? "" : "s"}`);
      setPage(1);
      await fetchMedia();
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(resolveMediaUrl(item.url));
      setCopiedId(item._id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Could not copy the URL");
    }
  };

  const handleDelete = async () => {
    if (!selectedMedia) return;
    try {
      await baseAPI.upload.deleteFile(selectedMedia._id);
      toast.success("File deleted");
      setIsDeleteModalOpen(false);
      setSelectedMedia(null);
      // Step back a page when the last item on it has gone.
      if (media.length === 1 && page > 1) setPage((p) => p - 1);
      else await fetchMedia();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Could not delete the file");
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleUpload(event.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-sm text-gray-600 mt-1">
            University logos, country flags and any other uploaded images
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition whitespace-nowrap disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload files"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wide">
            <ImageIcon className="h-4 w-4" /> Files
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wide">
            <HardDrive className="h-4 w-4" /> Storage used
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatBytes(totalBytes)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wide">
            <FileText className="h-4 w-4" /> Page
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{page} / {totalPages}</p>
        </div>
      </div>

      {/* Folders */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Folders
          </h3>
          {!newFolder.open && (
            <button
              onClick={() => setNewFolder({ open: true, name: "", error: "" })}
              className="text-xs font-medium text-primary hover:text-primary-700"
            >
              + New folder
            </button>
          )}
        </div>

        {/* Inline rather than window.prompt, so the name can be checked with a
            clear message. Folders exist only through the files in them, so
            selecting the new one and uploading is what creates it. */}
        {newFolder.open && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const name = newFolder.name.trim().toLowerCase();
              const error = rules.required("Folder name")(name) || rules.folderName()(name);
              if (error) {
                setNewFolder((prev) => ({ ...prev, error }));
                return;
              }
              setActiveFolder(name);
              setPage(1);
              setNewFolder({ open: false, name: "", error: "" });
              toast.success(`Now viewing "${name}". Upload files to create it.`);
            }}
            className="mb-3"
          >
            <div className="flex gap-2">
              <input
                autoFocus
                value={newFolder.name}
                onChange={(e) => setNewFolder({ open: true, name: e.target.value, error: "" })}
                maxLength={40}
                placeholder="Folder name, e.g. logos or flags"
                aria-invalid={Boolean(newFolder.error)}
                className={`flex-1 px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#22B2A8] focus:border-transparent ${newFolder.error ? "border-red-500" : "border-gray-300"}`}
              />
              <button type="submit" className="px-3 py-1.5 rounded-md bg-[#22B2A8] text-white text-sm hover:bg-[#1a9d8f]">
                Create
              </button>
              <button
                type="button"
                onClick={() => setNewFolder({ open: false, name: "", error: "" })}
                className="px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
            {newFolder.error && <p className="mt-1 text-xs text-red-600">{newFolder.error}</p>}
          </form>
        )}

        <div className="flex flex-wrap gap-2">
          {[
            { key: "", label: "All files", count: totalCount, icon: Layers },
            ...folders.map((folder) => ({
              key: folder.name || "__none__",
              label: folder.name || "Uncategorised",
              count: folder.count,
              icon: folder.name ? Folder : FileText,
            })),
          ].map((entry) => {
            const isActive = activeFolder === entry.key;
            const Icon = isActive && entry.key ? FolderOpen : entry.icon;
            return (
              <button
                key={entry.key || "all"}
                onClick={() => { setActiveFolder(entry.key); setPage(1); }}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="capitalize">{entry.label}</span>
                <span className={`text-xs ${isActive ? "text-white/80" : "text-gray-400"}`}>
                  {entry.count}
                </span>
              </button>
            );
          })}

          {/* A folder selected but not yet created shows until something lands in it. */}
          {activeFolder && activeFolder !== "__none__" &&
            !folders.some((folder) => folder.name === activeFolder) && (
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-white">
                <FolderOpen className="h-4 w-4" />
                <span className="capitalize">{activeFolder}</span>
                <span className="text-xs text-white/80">new</span>
              </span>
            )}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition ${
          isDragging ? "border-primary bg-primary-50" : "border-gray-300 hover:border-primary"
        }`}
      >
        <Upload className="h-8 w-8 mx-auto text-gray-400" />
        <p className="mt-3 text-sm font-medium text-gray-700">
          Drop images here, or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Up to {MAX_UPLOAD_BATCH} files at a time
          {activeFolder && activeFolder !== "__none__" && (
            <> · uploading into <span className="font-medium capitalize">{activeFolder}</span></>
          )}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Images are compressed and converted to WebP automatically
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by file name..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => { setTypeFilter(filter.value); setPage(1); }}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                typeFilter === filter.value
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="h-40 rounded-lg border border-gray-200 bg-gray-50 animate-pulse" />
          ))}
        </div>
      ) : media.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item._id}
              className="group relative rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition"
            >
              <div className="h-28 bg-gray-50 flex items-center justify-center overflow-hidden">
                {item.mimetype?.startsWith("image/") ? (
                  <img
                    src={resolveMediaUrl(item.url)}
                    alt={item.filename}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      // The file is missing from disk; show the fallback instead.
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div className={item.mimetype?.startsWith("image/") ? "hidden" : ""}>
                  <FileText className="h-8 w-8 text-gray-300" />
                </div>
              </div>

              <div className="p-3">
                <p className="text-xs font-medium text-gray-800 truncate" title={item.filename}>
                  {item.filename}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-500">
                  {formatBytes(item.size)}
                  {item.folder && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-gray-400 capitalize">
                      <Folder className="h-3 w-3" />
                      {item.folder}
                    </span>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
                <button
                  onClick={() => handleCopy(item)}
                  title="Copy URL"
                  className="p-1.5 rounded-md bg-white/90 border border-gray-200 text-gray-600 hover:text-primary"
                >
                  {copiedId === item._id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => { setSelectedMedia(item); setIsDeleteModalOpen(true); }}
                  title="Delete"
                  className="p-1.5 rounded-md bg-white/90 border border-gray-200 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="h-10 w-10 mx-auto text-gray-300" />
          <p className="mt-3 text-gray-600 font-medium">
            {searchTerm || typeFilter ? "No files match your search" : "No media uploaded yet"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter
              ? "Try a different file name or filter."
              : "Upload university logos and country flags to get started."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * PAGE_SIZE + 1} to {(page - 1) * PAGE_SIZE + media.length} of {totalCount} files
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 border rounded-md bg-gray-50">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete File"
        message={`Are you sure you want to delete ${selectedMedia?.filename}? Anything still using this image will lose it. This action cannot be undone.`}
      />
    </div>
  );
};

export default MediaPage;
