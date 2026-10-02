import React from 'react';

export default function SceneLighting() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top warm ambient sunbeam */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-b from-[#FFC857]/20 via-[#FF9F43]/10 to-transparent rounded-full blur-3xl opacity-70" />
      {/* Bottom subtle coral glow */}
      <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-gradient-to-tr from-[#FF7657]/15 to-transparent rounded-full blur-3xl opacity-60" />
    </div>
  );
}
