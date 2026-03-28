import { ReactNode } from 'react';
import { useDeviceType } from '../hooks/useDeviceType';

interface ResponsivePageWrapperProps {
  desktop: ReactNode;
  tablet?: ReactNode;
  mobile?: ReactNode;
}

export function ResponsivePageWrapper({ desktop, tablet, mobile }: ResponsivePageWrapperProps) {
  const deviceType = useDeviceType();

  if (deviceType === 'mobile' && mobile) {
    return <>{mobile}</>;
  }

  if (deviceType === 'tablet' && tablet) {
    return <>{tablet}</>;
  }

  return <>{desktop}</>;
}
