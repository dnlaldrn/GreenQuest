import React from "react";

function Bone({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-[#1f2b20] ${className}`} />;
}

export default function AdminTabSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* 4 KPI Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#161D16]/80 border border-[#3D4A3D]/40 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Bone className="h-3 w-24" />
              <Bone className="w-8 h-8 rounded-lg" />
            </div>
            <Bone className="h-8 w-20" />
            <Bone className="h-2.5 w-32" />
          </div>
        ))}
      </div>

      {/* Main Table / List Section Skeleton */}
      <div className="p-6 rounded-2xl bg-[#161D16]/80 border border-[#3D4A3D]/40 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Bone className="h-5 w-44" />
            <Bone className="h-3 w-64" />
          </div>
          <div className="flex items-center gap-3">
            <Bone className="h-9 w-40 rounded-lg" />
            <Bone className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        {/* Rows Skeleton */}
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl bg-[#121912]/60 border border-[#3D4A3D]/20 gap-4"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <Bone className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <Bone className="h-3.5 w-1/3 max-w-[200px]" />
                  <Bone className="h-2.5 w-1/2 max-w-[320px]" />
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Bone className="h-6 w-16 rounded-md hidden sm:block" />
                <Bone className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
