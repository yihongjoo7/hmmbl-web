// 'use client';

// import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
// import { FloatingPanelVariants } from './CustomFloatingPanel.styles';

// export interface FloatingPanelRef {
//   setHeight: (height: number) => void;
// }

// interface CustomFloatingPanelProps {
//   children?: React.ReactNode;
//   onHeightChange?: (height: number) => void;
//   className?: string;
// }

// export const CustomFloatingPanel = React.forwardRef<FloatingPanelRef, CustomFloatingPanelProps>(
//   ({ children, onHeightChange }, ref) => {
//     const [anchors, setAnchors] = useState<number[]>([100, 300, 600]);
//     const [height, setHeight] = useState(anchors[0]);
//     const [isDragging, setIsDragging] = useState(false);
//     const dragStateRef = useRef<{ startY: number; startHeight: number } | null>(null);

//     useEffect(() => {
//       if (typeof window === 'undefined') return;
//       const handleResize = () => {
//         const vh = window.innerHeight;
//         setAnchors([100, vh * 0.4, vh * 0.85]);
//       };
//       handleResize();
//       window.addEventListener('resize', handleResize);
//       return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const commitHeight = useCallback(
//       (h: number) => {
//         setHeight(h);
//         onHeightChange?.(h);
//       },
//       [onHeightChange]
//     );

//     useImperativeHandle(
//       ref,
//       () => ({
//         setHeight: (h: number) => commitHeight(h),
//       }),
//       [commitHeight]
//     );

//     const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
//       dragStateRef.current = { startY: e.clientY, startHeight: height };
//       setIsDragging(true);
//       e.currentTarget.setPointerCapture(e.pointerId);
//     };

//     const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
//       const dragState = dragStateRef.current;
//       if (!dragState) return;
//       const delta = dragState.startY - e.clientY;
//       const min = anchors[0];
//       const max = anchors[anchors.length - 1];
//       const next = Math.min(Math.max(dragState.startHeight + delta, min), max);
//       setHeight(next);
//       onHeightChange?.(next);
//     };

//     const handlePointerUp = () => {
//       if (!dragStateRef.current) return;
//       dragStateRef.current = null;
//       setIsDragging(false);
//       const nearest = anchors.reduce((prev, curr) =>
//         Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
//       );
//       commitHeight(nearest);
//     };

//     return (
//       <div
//         className={FloatingPanelVariants()}
//         style={{
//           height,
//           transition: isDragging ? 'none' : 'height 0.3s ease',
//           touchAction: 'none',
//         }}
//       >
//         <div
//           onPointerDown={handlePointerDown}
//           onPointerMove={handlePointerMove}
//           onPointerUp={handlePointerUp}
//           className="w-full h-[32px] flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing"
//         >
//           <div className="w-12 h-[5px] bg-outline-400 rounded-full pointer-events-none" />
//         </div>
//         <div className="p-4 h-[calc(100%-32px)] overflow-y-auto pb-10 select-none">{children}</div>
//       </div>
//     );
//   }
// );

// CustomFloatingPanel.displayName = 'CustomFloatingPanel';
