import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  PanResponder,
} from 'react-native';
import { Canvas, Path, Skia, SkPath } from '@shopify/react-native-skia';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styles } from './styles';

interface IPath {
  path: SkPath;
  color: string;
  stroke: number;
}

export default function App() {
  const [paths, setPaths] = useState<IPath[]>([]);
  const [redoPath, setRedoPath] = useState<IPath[]>([]);
  const [undoPath, setUndoPath] = useState<IPath[]>([]);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('black');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);

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
    const newPath = Skia.Path.Make();
    newPath.moveTo(touchInfo.nativeEvent.locationX, touchInfo.nativeEvent.locationY);
    setCurrentPath(newPath);
  };

  const handleTouchMove = (touchInfo) => {
    if (!currentPath) return;
    currentPath.lineTo(touchInfo.nativeEvent.locationX, touchInfo.nativeEvent.locationY);
    setCurrentPath(currentPath.copy());
  };

  const handleTouchEnd = () => {
    if (currentPath) {
      setPaths((prev) => [...prev, { path: currentPath, color: selectedColor, stroke: strokeWidth }]);
      setCurrentPath(null);
    }
  };

  const handleRedo = () => {
    console.log("handleRedo")
  }

  const handleUndo = () => {
    if (paths.length === 0) return;
    setPaths((prev) => prev.slice(0, -1));
  }

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
        {paths.map((item, index) => (
          <Path
            key={`path-${index}`}
            path={item.path}
            color={item.color}
            style="stroke"
            strokeWidth={item.stroke}
          />
        ))}
        {currentPath && (
          <Path
            path={currentPath}
            color={selectedColor}
            style="stroke"
            strokeWidth={strokeWidth}
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
        <TouchableOpacity
          onPress={handleRedo}
          style={{ marginLeft: 20 }}
        >
          <Ionicons name="arrow-redo" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUndo}
          style={{ marginLeft: 20 }}
        >
          <Ionicons name="arrow-undo" size={24} color="black" />
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