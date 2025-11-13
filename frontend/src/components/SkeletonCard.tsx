export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full mr-4" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-6 bg-gray-200 rounded w-14" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-24" />
        <div className="h-6 bg-gray-200 rounded w-20" />
      </div>
    </div>
  )
}



