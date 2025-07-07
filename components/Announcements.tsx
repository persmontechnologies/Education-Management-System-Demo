import React, { useState } from 'react';
import { Announcement } from '../types';
import Modal from './Modal';
import Card from './ui/Card';
import { Plus, Megaphone } from 'lucide-react';
import { formatFullDate } from '../lib/dateUtils';

interface AnnouncementsProps {
  announcements: Announcement[];
  onAdd: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
}

const emptyAnnouncement: Omit<Announcement, 'id' | 'date'> = {
  title: '',
  content: '',
};

const Announcements: React.FC<AnnouncementsProps> = ({ announcements, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState(emptyAnnouncement);

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncement.title && newAnnouncement.content) {
      onAdd(newAnnouncement);
      setNewAnnouncement(emptyAnnouncement);
      closeModal();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Announcements</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md transition-transform hover:scale-105">
          <Plus className="w-5 h-5 mr-2"/>
          New Announcement
        </button>
      </div>

      <div className="space-y-6">
        {announcements.length > 0 ? (
          announcements.map(announcement => (
            <Card key={announcement.id}>
              <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-300"/>
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{announcement.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{formatFullDate(new Date(announcement.date))}</p>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{announcement.content}</p>
                  </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <h3 className="text-xl font-semibold">No Announcements Yet</h3>
            <p className="text-gray-500 mt-2">Create the first announcement to get started.</p>
          </Card>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="New Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input type="text" name="title" id="title" value={newAnnouncement.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            <textarea name="content" id="content" rows={5} value={newAnnouncement.content} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
          </div>
          <div className="flex justify-end pt-4 space-x-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Post Announcement</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Announcements;