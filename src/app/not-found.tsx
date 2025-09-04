import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-antonio font-bold">404</h2>
        <h3 className="text-2xl font-semibold">Page Not Found</h3>
        <p className="text-gray-300">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
