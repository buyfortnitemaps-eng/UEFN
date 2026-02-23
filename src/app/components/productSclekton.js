const ProductSkeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-56 bg-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
    <div className="p-6">
      <div className="h-6 bg-white/10 rounded-md w-3/4 mb-4" />
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-white/10 rounded-md w-full" />
        <div className="h-3 bg-white/10 rounded-md w-5/6" />
      </div>
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="space-y-2">
          <div className="h-2 bg-white/10 rounded-md w-10" />
          <div className="h-6 bg-white/10 rounded-md w-16" />
        </div>
        <div className="h-12 w-12 bg-white/10 rounded-xl" />
      </div>
    </div>
  </div>
);

export default ProductSkeleton;