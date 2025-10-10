'use client';
import { useState } from 'react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('theitxprts786@gmail.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSendEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: email }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Email Test
          </h1>
          <p className="text-gray-600 mb-6">
            Test your Nodemailer configuration
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Recipient Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter recipient email"
              />
            </div>

            <button
              onClick={handleSendEmail}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Test Email'
              )}
            </button>
          </div>

          {result && (
            <div
              className={`mt-6 p-4 rounded-md ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {result.success ? (
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.success ? 'Success!' : 'Error'}
                  </h3>
                  <div
                    className={`mt-2 text-sm ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {result.success ? (
                      <div>
                        <p>{result.message}</p>
                        <p className="mt-1 text-xs">
                          Recipient: {result.recipient}
                        </p>
                        {result.messageId && (
                          <p className="mt-1 text-xs">
                            Message ID: {result.messageId}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p>{result.error}</p>
                        {result.details && (
                          <p className="mt-1 text-xs">{result.details}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              ⚙️ Configuration
            </h3>
            <p className="text-xs text-blue-700">
              Your <code className="bg-blue-100 px-1 py-0.5 rounded">.env</code> file should contain:
            </p>
            <pre className="mt-2 text-xs bg-blue-100 p-2 rounded overflow-x-auto text-blue-900">
SMTP_HOST=smtp.your-provider.com{'\n'}
SMTP_PORT=465{'\n'}
SMTP_USER=your-email@domain.com{'\n'}
SMTP_PASS=your-password{'\n'}
SMTP_SECURE=true
            </pre>
            <p className="mt-2 text-xs text-blue-700">
              Using Titan Email (smtp.titan.email) configuration from your .env file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

