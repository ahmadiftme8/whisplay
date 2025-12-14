# Audio Assets Organization

Place your audio files (MP3, WAV, OGG) in the corresponding folders:

- **white-noise/**: Static noise, fan sounds, pink noise, etc.
- **nature/**: Rain, thunder, wind, ocean waves, forest sounds.
- **ambient/**: Drone sounds, soft pads, musical textures.

## Naming Convention
Keep filenames simple and lowercase with hyphens, e.g., `heavy-rain.mp3`, `soft-drone.wav`.

## Usage in Code
When adding these to the `useMixStore.ts`, reference them like this:
```typescript
{ 
  id: 0, 
  name: "Rain", 
  sampleUrl: "/sounds/nature/rain.mp3", 
  // ... 
}
```
