import React, { useState } from 'react';
import Modal from './Modal';
import { generateText } from '../services/geminiService';
import { Sparkles } from 'lucide-react';

const GeminiHelper: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError('');
    setResult('');
    try {
      const text = await generateText(prompt);
      setResult(text);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionPrompts = [
    "Write a positive opening for a school newsletter.",
    "Suggest 3 discussion points for a parent-teacher meeting about a gifted student.",
    "Draft a brief, encouraging email to a teacher who seems overworked.",
    "Create a short description for a new 'Digital Literacy' club.",
  ];

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-full p-4 shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-110"
        title="AI Assistant"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-8 h-8" />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="AI Administrative Assistant">
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">How can I help you today?</label>
            <textarea
              id="prompt"
              name="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 'Draft a welcome email for new parents...'"
            />
          </div>
          
          <div className="text-sm">
             <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Or try a suggestion:</p>
             <div className="flex flex-wrap gap-2">
                {suggestionPrompts.map((p, i) => (
                    <button key={i} onClick={() => setPrompt(p)} className="text-xs bg-gray-200 dark:bg-gray-700/50 px-3 py-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{p}</button>
                ))}
             </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          
          {(result || error) && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">Assistant's Response</h3>
                {error && <p className="text-red-500">{error}</p>}
                {result && <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</p>}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default GeminiHelper;