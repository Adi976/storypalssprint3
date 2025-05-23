import React from 'react';
import { Skeleton as MuiSkeleton, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSkeleton = styled(MuiSkeleton)(({ theme }) => ({
  backgroundColor: 'rgba(123, 94, 167, 0.1)',
  '&::after': {
    background: 'linear-gradient(90deg, transparent, rgba(123, 94, 167, 0.1), transparent)',
  },
}));

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'wave',
}) => {
  return (
    <StyledSkeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
    />
  );
};

export const CardSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="40%" height={24} />
  </Box>
);

export const ListSkeleton = ({ count = 3 }) => (
  <Box sx={{ p: 2 }}>
    {Array.from(new Array(count)).map((_, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
      </Box>
    ))}
  </Box>
);

export const ProfileSkeleton = () => (
  <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Skeleton variant="circular" width={80} height={80} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={24} />
    </Box>
  </Box>
); 