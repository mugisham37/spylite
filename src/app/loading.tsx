export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        <p className="text-white text-lg font-antonio">Loading SPYLT...</p>
      </div>
    </div>
  );
}
