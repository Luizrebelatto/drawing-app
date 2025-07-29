// import React, { useState, useRef } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   PanResponder,
// } from 'react-native';
// import { Canvas, Path, Skia, SkPath } from '@shopify/react-native-skia';
// import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// import Foundation from '@expo/vector-icons/Foundation';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { styles } from './styles';

// interface IPath {
//   path: SkPath;
//   color: string;
//   stroke: number;
// }

// export default function App() {
//   const [paths, setPaths] = useState<IPath[]>([]);
//   const [redoPath, setRedoPath] = useState<IPath[]>([]);
//   const [currentPath, setCurrentPath] = useState<SkPath | null>(null);
//   const [selectedColor, setSelectedColor] = useState<string>('black');
//   const [strokeWidth, setStrokeWidth] = useState<number>(4);

//   const sliderHeight = 150;

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: (_, gestureState) => {
//         const rawValue = sliderHeight - gestureState.dy;
//         const value = Math.max(1, Math.min(30, rawValue / 5));
//         setStrokeWidth(Math.round(value));
//       },
//     })
//   ).current;

//   const handleTouchStart = (touchInfo) => {
//     const newPath = Skia.Path.Make();
//     newPath.moveTo(touchInfo.nativeEvent.locationX, touchInfo.nativeEvent.locationY);
//     setCurrentPath(newPath);
//   };

//   const handleTouchMove = (touchInfo) => {
//     if (!currentPath) return;
//     currentPath.lineTo(touchInfo.nativeEvent.locationX, touchInfo.nativeEvent.locationY);
//     setCurrentPath(currentPath.copy());
//   };

//   const handleTouchEnd = () => {
//     if (currentPath) {
//       setPaths((prev) => [...prev, { path: currentPath, color: selectedColor, stroke: strokeWidth }]);
//       setCurrentPath(null);
//       setRedoPath([]); 
//     }
//   };

//   const handleUndo = () => {
//     if (paths.length === 0) return;
  
//     setPaths((prevPaths) => {
//       const newPaths = [...prevPaths];
//       const last = newPaths.pop();
  
//       if (last) {
//         setRedoPath((prevRedo) => [...prevRedo, last]);
//       }
  
//       return newPaths;
//     });
//   };
  
//   const handleRedo = () => {
//     if (redoPath.length === 0) return;
  
//     setRedoPath((prevRedo) => {
//       const newRedo = [...prevRedo];
//       const last = newRedo.pop();
  
//       if (last) {
//         setPaths((prevPaths) => [...prevPaths, last]);
//       }
  
//       return newRedo;
//     });
//   };
  

//   const COLORS = ['black', 'red', 'blue', 'green', 'orange'];
//   const ERASER_COLOR = 'white';

//   return (
//     <View style={styles.wrapper}>
//       <Canvas
//         style={styles.canvas}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//       >
//         {paths.map((item, index) => (
//           <Path
//             key={`path-${index}`}
//             path={item.path}
//             color={item.color}
//             style="stroke"
//             strokeWidth={item.stroke}
//           />
//         ))}
//         {currentPath && (
//           <Path
//             path={currentPath}
//             color={selectedColor}
//             style="stroke"
//             strokeWidth={strokeWidth}
//           />
//         )}
//       </Canvas>

//       <View style={styles.colorPicker}>
//         {COLORS.map((color) => (
//           <TouchableOpacity
//             key={color}
//             onPress={() => setSelectedColor(color)}
//             style={{ marginLeft: 20 }}
//           >
//             <Foundation name="paint-bucket" size={24} color={color} />
//           </TouchableOpacity>
//         ))}

//         <TouchableOpacity
//           onPress={() => setSelectedColor(ERASER_COLOR)}
//           style={{ marginLeft: 20 }}
//         >
//           <FontAwesome6 name="eraser" size={24} color="black" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={handleRedo}
//           style={{ marginLeft: 20 }}
//         >
//           <Ionicons name="arrow-redo" size={24} color="black" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={handleUndo}
//           style={{ marginLeft: 20 }}
//         >
//           <Ionicons name="arrow-undo" size={24} color="black" />
//         </TouchableOpacity>
//         <View style={styles.sliderContainer}>
//           <View style={styles.sliderTrack} {...panResponder.panHandlers}>
//             <View style={[styles.sliderIndicator, { height: strokeWidth * 2 }]} />
//           </View>
//           <Text style={styles.strokeLabel}>{strokeWidth}px</Text>
//         </View>
       
//       </View>
//     </View>
//   );
// }
import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  PanResponder,
} from 'react-native';
import {
  Canvas,
  Path,
  Skia,
  SkPath,
  Circle,
  Rect,
} from '@shopify/react-native-skia';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styles } from './styles';

interface IPath {
  type: 'path' | 'circle' | 'rect';
  path?: SkPath;
  color: string;
  stroke: number;
  cx?: number;
  cy?: number;
  r?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export default function App() {
  const [paths, setPaths] = useState<IPath[]>([]);
  const [redoPath, setRedoPath] = useState<IPath[]>([]);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('black');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [drawingMode, setDrawingMode] = useState<'freehand' | 'circle' | 'rectangle'>('freehand');
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [previewShape, setPreviewShape] = useState<IPath | null>(null);

  const sliderHeight = 150;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const rawValue = sliderHeight - gestureState.dy;
        const value = Math.max(1, Math.min(30, rawValue / 5));
        setStrokeWidth(Math.round(value));
      },
    })
  ).current;

  const handleTouchStart = (touchInfo) => {
    const x = touchInfo.nativeEvent.locationX;
    const y = touchInfo.nativeEvent.locationY;

    if (drawingMode === 'freehand') {
      const newPath = Skia.Path.Make();
      newPath.moveTo(x, y);
      setCurrentPath(newPath);
    } else {
      setStartPoint({ x, y });
    }
  };

  const handleTouchMove = (touchInfo) => {
    const x = touchInfo.nativeEvent.locationX;
    const y = touchInfo.nativeEvent.locationY;

    if (drawingMode === 'freehand') {
      if (!currentPath) return;
      currentPath.lineTo(x, y);
      setCurrentPath(currentPath.copy());
    } else if (startPoint) {
      if (drawingMode === 'circle') {
        const r = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
        setPreviewShape({
          type: 'circle',
          cx: startPoint.x,
          cy: startPoint.y,
          r,
          color: selectedColor,
          stroke: strokeWidth,
        });
      } else if (drawingMode === 'rectangle') {
        setPreviewShape({
          type: 'rect',
          x: Math.min(startPoint.x, x),
          y: Math.min(startPoint.y, y),
          width: Math.abs(x - startPoint.x),
          height: Math.abs(y - startPoint.y),
          color: selectedColor,
          stroke: strokeWidth,
        });
      }
    }
  };

  const handleTouchEnd = () => {
    if (drawingMode === 'freehand') {
      if (currentPath) {
        setPaths((prev) => [...prev, { type: 'path', path: currentPath, color: selectedColor, stroke: strokeWidth }]);
        setCurrentPath(null);
        setRedoPath([]);
      }
    } else if (previewShape) {
      setPaths((prev) => [...prev, previewShape]);
      setPreviewShape(null);
      setStartPoint(null);
      setRedoPath([]);
    }
  };

  const handleUndo = () => {
    if (paths.length === 0) return;

    setPaths((prevPaths) => {
      const newPaths = [...prevPaths];
      const last = newPaths.pop();

      if (last) {
        setRedoPath((prevRedo) => [...prevRedo, last]);
      }

      return newPaths;
    });
  };

  const handleRedo = () => {
    if (redoPath.length === 0) return;

    setRedoPath((prevRedo) => {
      const newRedo = [...prevRedo];
      const last = newRedo.pop();

      if (last) {
        setPaths((prevPaths) => [...prevPaths, last]);
      }

      return newRedo;
    });
  };

  const COLORS = ['black', 'red', 'blue', 'green', 'orange'];
  const ERASER_COLOR = 'white';

  return (
    <View style={styles.wrapper}>
      <Canvas
        style={styles.canvas}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {paths.map((item, index) => {
          if (item.type === 'path' && item.path) {
            return (
              <Path
                key={index}
                path={item.path}
                color={item.color}
                style="stroke"
                strokeWidth={item.stroke}
              />
            );
          } else if (item.type === 'circle') {
            return (
              <Circle
                key={index}
                cx={item.cx!}
                cy={item.cy!}
                r={item.r!}
                color={item.color}
                style="stroke"
                strokeWidth={item.stroke}
              />
            );
          } else if (item.type === 'rect') {
            return (
              <Rect
                key={index}
                x={item.x!}
                y={item.y!}
                width={item.width!}
                height={item.height!}
                color={item.color}
                style="stroke"
                strokeWidth={item.stroke}
              />
            );
          }
        })}

        {previewShape?.type === 'circle' && (
          <Circle
            cx={previewShape.cx!}
            cy={previewShape.cy!}
            r={previewShape.r!}
            color={previewShape.color}
            style="stroke"
            strokeWidth={previewShape.stroke}
          />
        )}

        {previewShape?.type === 'rect' && (
          <Rect
            x={previewShape.x!}
            y={previewShape.y!}
            width={previewShape.width!}
            height={previewShape.height!}
            color={previewShape.color}
            style="stroke"
            strokeWidth={previewShape.stroke}
          />
        )}
      </Canvas>

      <View style={styles.colorPicker}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => setSelectedColor(color)}
            style={{ marginLeft: 20 }}
          >
            <Foundation name="paint-bucket" size={24} color={color} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => setSelectedColor(ERASER_COLOR)}
          style={{ marginLeft: 20 }}
        >
          <FontAwesome6 name="eraser" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRedo} style={{ marginLeft: 20 }}>
          <Ionicons name="arrow-redo" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleUndo} style={{ marginLeft: 20 }}>
          <Ionicons name="arrow-undo" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setDrawingMode('freehand')} style={{ marginLeft: 20 }}>
          <Text>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDrawingMode('circle')} style={{ marginLeft: 20 }}>
          <Text>⚪</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDrawingMode('rectangle')} style={{ marginLeft: 20 }}>
          <Text>▭</Text>
        </TouchableOpacity>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack} {...panResponder.panHandlers}>
            <View style={[styles.sliderIndicator, { height: strokeWidth * 2 }]} />
          </View>
          <Text style={styles.strokeLabel}>{strokeWidth}px</Text>
        </View>
      </View>
    </View>
  );
}
