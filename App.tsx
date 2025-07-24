import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Canvas, Path, Skia, SkPath } from '@shopify/react-native-skia';

export default function App() {
  const [paths, setPaths] = useState<SkPath[]>([]);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);

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
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath(null);
    }
  };

  return (
    <Canvas
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {paths.map((path, index) => (
        <Path
          key={`path-${index}`}
          path={path}
          color="black"
          style="stroke"
          strokeWidth={4}
        />
      ))}
      {currentPath && (
        <Path
          path={currentPath}
          color="gray"
          style="stroke"
          strokeWidth={4}
        />
      )}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
