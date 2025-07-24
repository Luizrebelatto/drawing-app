import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  PanResponder,
  Animated,
} from 'react-native';
import { Canvas, Path, Skia, SkPath } from '@shopify/react-native-skia';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function App() {
  const [paths, setPaths] = useState<{ path: SkPath; color: string; stroke: number }[]>([]);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('black');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);

  const sliderHeight = 150;
  const pan = useRef(new Animated.Value(0)).current;

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
            style={[
              styles.colorButton,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor,
            ]}
          />
        ))}

        <TouchableOpacity
          onPress={() => setSelectedColor(ERASER_COLOR)}
        >
          <FontAwesome6 name="eraser" size={24} color="black" />
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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    backgroundColor: 'white',
  },
  colorPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
  },
  eraserButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedEraser: {
    backgroundColor: '#ccc',
  },
  eraserText: {
    fontWeight: 'bold',
    color: '#000',
  },
  thicknessButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    alignItems: 'center',
  },
  sliderTrack: {
    width: 40,
    height: 150,
    backgroundColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sliderIndicator: {
    width: 20,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  strokeLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
