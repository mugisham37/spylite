import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex-center bg-dark-brown">
      <div className="col-center gap-8 p-8 max-w-4xl w-full">
        <h1 className="general-title text-milk text-center">404</h1>
        <p className="font-paragraph text-milk text-center max-w-2xl">
          Page not found. The page you are looking for does not exist.
        </p>
        <Link href="/" className="hero-button">
          Go Home
        </Link>
      </div>
    </div>
  );
}
