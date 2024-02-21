import * as React from 'react';

import { useConfig } from 'ui/hooks';
import { Style } from 'ui/utils';

interface StyleWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  styleName?: Style['name'];
}

export function StyleWrapper({ styleName, children }: StyleWrapperProps) {
  const [config] = useConfig();

  if (!styleName || config.style === styleName) {
    return <>{children}</>;
  }

  return null;
}
