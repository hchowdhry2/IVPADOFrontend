# Loading States Quick Reference

## Quick Start

### 1. Full-Page Loading Overlay
Show a loading overlay when fetching data:

```tsx
import LoadingOverlay from '../components/LoadingOverlay';

function MyComponent() {
  const { loading } = useDevOpsContext();
  
  return (
    <>
      <LoadingOverlay isLoading={loading} message="Loading data..." />
      {/* Your content */}
    </>
  );
}
```

### 2. Skeleton Loaders for Charts
Charts automatically show skeletons when loading:

```tsx
// Automatically handles loading state
<HighChartsBarChart data={data} workType={workType} />

// Or pass loading prop explicitly
<DeveloperBarChart loading={loading} stats={stats} />
```

### 3. Skeleton Loaders for Cards
Show loading state for card components:

```tsx
<ImpactedFeaturesCard 
  loading={loading} 
  features={features} 
/>
```

### 4. Skeleton Loaders for Grids
Display grid skeleton during data fetch:

```tsx
<DeveloperPerformanceGrid
  loading={loading}
  stats={stats}
  selectedDev={dev}
  fullData={data}
/>
```

### 5. Custom Skeleton Component
Create custom skeletons for any component type:

```tsx
import LoadingSkeleton from '../components/LoadingSkeleton';

// Chart skeleton (400px height)
<LoadingSkeleton type="chart" height="400px" />

// Card skeleton (200px height)
<LoadingSkeleton type="card" height="200px" />

// Grid skeleton with 6 items
<LoadingSkeleton type="grid" count={6} />

// Text skeleton with 3 lines
<LoadingSkeleton type="text" count={3} />
```

## Component Props

### LoadingOverlay
```tsx
interface LoadingOverlayProps {
  isLoading: boolean;      // Show/hide overlay
  message?: string;        // Custom loading message
}
```

### LoadingSkeleton
```tsx
interface LoadingSkeletonProps {
  type?: 'chart' | 'card' | 'grid' | 'text';  // Skeleton type
  count?: number;          // Number of items (for grid/text)
  height?: string;         // Custom height (e.g., '400px')
  width?: string;          // Custom width (e.g., '100%')
}
```

## Preset Heights

### For Charts
- Line/Bar Charts: `400px - 500px`
- Trend Charts: `300px - 350px`
- Full Dashboard: Use component defaults

### For Cards
- Feature Cards: `200px`
- Performance Cards: `200px`

### For Grids
- Developer Stats: 4 items
- Feature List: 3 items
- Sprint Data: 6 items

## Implementation Pattern

All components follow this pattern:

```tsx
// 1. Receive loading prop
const MyChart: React.FC<Props> = ({ data, loading = false }) => {
  
  // 2. Check loading state
  if (loading || !data) {
    return <LoadingSkeleton type="chart" height="400px" />;
  }
  
  // 3. Render actual content
  return <YourChartComponent data={data} />;
};
```

## Global Loading State
Access from DevOpsProvider context:

```tsx
const { loading } = useDevOpsContext();
// loading: boolean - true while fetching data
```

## Styling Customization

### Change Skeleton Color
Edit `LoadingSkeleton.css` - modify the gradient colors:

```css
.skeleton-bar {
  background: linear-gradient(
    90deg,
    #YOUR_COLOR_1 0%,
    #YOUR_COLOR_2 50%,
    #YOUR_COLOR_1 100%
  );
}
```

### Change Animation Speed
Edit animation duration (default: 1.5s):

```css
.skeleton-bar {
  animation: loading 2s infinite;  /* Changed from 1.5s */
}
```

### Change Overlay Opacity
Edit `LoadingOverlay.css`:

```css
.loading-overlay {
  background: rgba(255, 255, 255, 0.85);  /* Change from 0.95 */
}
```

## Best Practices

✅ **Do:**
- Use LoadingOverlay for critical data fetches
- Show skeleton loaders for individual components
- Disable inputs during loading (Selector handles this)
- Provide meaningful loading messages
- Keep loading animations subtle and smooth

❌ **Don't:**
- Show multiple overlays at once
- Use skeleton loaders for small data
- Load skeletons for more than 5 seconds (indicates problem)
- Animate everything (focus on main content areas)

## Troubleshooting

### Skeleton not showing
- Check if `loading` prop is being passed
- Verify `loading` state in DevOpsContext
- Ensure LoadingSkeleton import path is correct

### Overlay not appearing
- Confirm `isLoading={loading}` is set correctly
- Check z-index of other elements (overlay has z-index: 2000)
- Verify LoadingOverlay component is imported

### Animation looks choppy
- Check browser GPU acceleration
- Verify CSS animations are not disabled
- Test in different browser

## Common Patterns

### Pattern 1: Full Dashboard Loading
```tsx
<LoadingOverlay isLoading={loading && !data} />
<DashboardContent data={data} />
```

### Pattern 2: Selective Component Loading
```tsx
<Chart1 loading={loading} data={data1} />
<Chart2 loading={loading} data={data2} />
```

### Pattern 3: Conditional Skeleton
```tsx
{!data ? <LoadingSkeleton /> : <RealComponent data={data} />}
```

### Pattern 4: Disabled with Loading State
```tsx
<button disabled={loading}>
  {loading ? 'Loading...' : 'Click me'}
</button>
```

## Performance Tips

- Skeleton loaders are lightweight CSS animations
- No performance impact on real data rendering
- Safe to use multiple skeletons simultaneously
- Loading states don't trigger unnecessary re-renders
- CSS animations are GPU-accelerated

---

For more details, see `LOADING_IMPLEMENTATION.md`
