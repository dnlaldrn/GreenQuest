import React from "react";

function Bone({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-[#1d271e] ${className}`} />;
}

export default function FacultyTabSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Hero Welcome Banner Skeleton */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#141c14] p-6 sm:p-8">
        <div className="space-y-3 max-w-xl">
          <Bone className="h-4 w-32 bg-[#253627]" />
          <Bone className="h-8 w-64 sm:w-96" />
          <Bone className="h-4 w-48 sm:w-80" />
        </div>
      </div>

      {/* 4 Bento Metric Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#141c14] border border-white/10 p-4 sm:p-5 rounded-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <Bone className="h-3 w-20" />
              <Bone className="w-8 h-8 rounded-xl" />
            </div>
            <Bone className="h-7 w-24" />
            <Bone className="h-2.5 w-32" />
          </div>
        ))}
      </div>

      {/* Main Content Layout Skeleton (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form / Primary Widget Skeleton */}
        <div className="lg:col-span-1 bg-[#141c14] border border-white/10 rounded-2xl p-5 space-y-4">
          <Bone className="h-5 w-40" />
          <Bone className="h-3 w-48" />
          <div className="h-36 rounded-xl border border-dashed border-white/10 flex items-center justify-center p-4">
            <Bone className="w-12 h-12 rounded-full" />
          </div>
          <Bone className="h-10 w-full rounded-xl" />
        </div>

        {/* Right Column - Cards Grid Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Bone className="h-5 w-36" />
            <Bone className="h-7 w-20 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#141c14] border border-white/10 rounded-xl p-4 space-y-3"
              >
                <Bone className="aspect-video w-full rounded-lg" />
                <Bone className="h-3 w-20" />
                <Bone className="h-4 w-3/4" />
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <Bone className="h-3 w-16" />
                  <Bone className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
