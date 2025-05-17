import React, { useState } from 'react';

interface NewsletterSubscribeProps {
  className?: string;
}

const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Determine the API URL based on the current environment
  const apiUrl = import.meta.env.MODE === 'production'
    ? 'https://kvant-2.com/api/subscribe'
    : 'http://kvant-2.com.test/api/subscribe';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If honeypot field is filled, silently ignore the submission (it's likely a bot)
    if (honeypot) {
      // Pretend success but don't submit
      setStatus('success');
      return;
    }

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setStatus('loading');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed. Please try again later.');
      }

      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage('An unknown error occurred');
    }
  };

  return (
    <div className={`newsletter-subscribe ${className}`}>
      <h3 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">Subscribe to the newsletter</h3>
      <p className="text-base text-zinc-500 mb-4">Get the latest articles and updates delivered to your inbox.</p>

      {status === 'success' ? (
        <div className="bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-md p-4">
          Thank you for subscribing! You'll receive updates soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-zinc-100 p-6 rounded-md">
          <div className="space-y-3">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
              Email address
            </label>
            <div className="flex space-x-3">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 bg-white"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 whitespace-nowrap"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </div>

          {/* Honeypot field - hidden from users but bots will fill it */}
          <div className="hidden">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {status === 'error' && (
            <div className="mt-3 text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-md p-3 text-sm">{errorMessage}</div>
          )}
        </form>
      )}
    </div>
  );
};

export default NewsletterSubscribe;
