export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          About UMA Table
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-600 mb-4">
            This is a Next.js 14 application built with modern web technologies.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Features include:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>App Router for better routing and layouts</li>
            <li>Server Components for improved performance</li>
            <li>TypeScript for type safety</li>
            <li>Tailwind CSS for styling</li>
            <li>Responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 