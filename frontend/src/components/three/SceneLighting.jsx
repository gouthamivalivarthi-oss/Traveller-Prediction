import React from 'react';

export default function SceneLighting() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top cool ambient sapphire sunbeam */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-b from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl opacity-60" />
      {/* Bottom subtle cyan glow */}
      <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-gradient-to-tr from-cyan-500/15 to-transparent rounded-full blur-3xl opacity-50" />
    </div>
  );
}
