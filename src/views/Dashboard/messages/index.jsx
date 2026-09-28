'use client';

import { useCallback, useEffect, useState } from "react";
import { Mail, MailOpen, Phone, Trash2, Inbox } from "lucide-react";
import toast from "react-hot-toast";
import { baseAPI } from "../../../config/api";
import DeleteModal from "../../../components/ui/DeleteModal";

const PAGE_SIZE = 20;

const formatDate = (value) =>
  new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Messages sent from the public contact form (/contact).
const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, unread: 0 });
  const [expandedId, setExpandedId] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await baseAPI.contact.getAll({ page, limit: PAGE_SIZE, unread: unreadOnly });
      if (!response?.success) {
        toast.error(response?.message || "Could not load messages");
        setMessages([]);
        return;
      }
      setMessages(response.data?.data ?? []);
      setPagination(response.data?.pagination ?? { total: 0, totalPages: 1, unread: 0 });
    } catch {
      toast.error("Could not load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [page, unreadOnly]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const setRead = async (message, isRead) => {
    const response = await baseAPI.contact.setRead(message._id, isRead);
    if (!response?.success) {
      toast.error(response?.message || "Could not update message");
      return;
    }
    setMessages((prev) => prev.map((m) => (m._id === message._id ? { ...m, isRead } : m)));
    setPagination((prev) => ({ ...prev, unread: Math.max(0, prev.unread + (isRead ? -1 : 1)) }));
  };

  // Opening an unread message marks it read.
  const toggleOpen = (message) => {
    const opening = expandedId !== message._id;
    setExpandedId(opening ? message._id : null);
    if (opening && !message.isRead) setRead(message, true);
  };

  const confirmDelete = async () => {
    const response = await baseAPI.contact.remove(toDelete._id);
    if (response?.success) {
      toast.success("Message deleted");
      await fetchMessages();
    } else {
      toast.error(response?.message || "Could not delete message");
    }
    setToDelete(null);
  };

  const showFilter = (value) => {
    setUnreadOnly(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-600 mt-1">
            Sent from the website&apos;s contact form · {pagination.unread} unread
          </p>
        </div>
        <div className="inline-flex rounded-md border border-gray-300 overflow-hidden text-sm">
          {[
            [false, "All"],
            [true, "Unread"],
          ].map(([value, label]) => (
            <button
              key={label}
              onClick={() => showFilter(value)}
              className={`px-4 py-2 ${unreadOnly === value ? "bg-[#22B2A8] text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-5 animate-pulse">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="mt-3 h-3 w-2/3 bg-gray-100 rounded" />
            </div>
          ))
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Inbox className="w-10 h-10 mx-auto text-gray-300" />
            <p className="mt-3">{unreadOnly ? "No unread messages." : "No messages yet."}</p>
          </div>
        ) : (
          messages.map((message) => {
            const open = expandedId === message._id;
            return (
              <article key={message._id} className={message.isRead ? "" : "bg-[#eefbfa]"}>
                <button
                  onClick={() => toggleOpen(message)}
                  aria-expanded={open}
                  className="w-full text-left p-5 flex items-start gap-4 hover:bg-gray-50/70"
                >
                  <span
                    className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${message.isRead ? "bg-transparent" : "bg-[#22B2A8]"}`}
                    aria-label={message.isRead ? undefined : "Unread"}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <p className={`text-gray-900 ${message.isRead ? "font-medium" : "font-bold"}`}>
                        {message.firstName} {message.lastName}
                      </p>
                      <time className="text-xs text-gray-500" dateTime={message.createdAt}>
                        {formatDate(message.createdAt)}
                      </time>
                    </div>
                    <p className="text-sm text-gray-500">{message.email}</p>
                    <p className={`mt-1 text-sm text-gray-700 ${open ? "whitespace-pre-line" : "line-clamp-1"}`}>
                      {message.message || <span className="italic text-gray-400">No message</span>}
                    </p>
                  </div>
                </button>

                {open && (
                  <div className="px-5 pb-5 pl-[3.25rem] flex flex-wrap items-center gap-3">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent("Re: your message to Veritas Pathways")}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#22B2A8] text-white text-sm hover:bg-[#1a9d8f]"
                    >
                      <Mail className="w-4 h-4" /> Reply by email
                    </a>
                    <a
                      href={`tel:${message.phone.replace(/[^0-9+]/g, "")}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Phone className="w-4 h-4" /> {message.phone}
                    </a>
                    <button
                      onClick={() => setRead(message, !message.isRead)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {message.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                      Mark as {message.isRead ? "unread" : "read"}
                    </button>
                    <button
                      onClick={() => setToDelete(message)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md bg-white disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border rounded-md bg-white disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      <DeleteModal
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete message"
        message={toDelete ? `Delete the message from ${toDelete.firstName} ${toDelete.lastName}? This cannot be undone.` : ""}
      />
    </div>
  );
};

export default MessagesPage;
