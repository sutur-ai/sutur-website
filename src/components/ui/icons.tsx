import { ArrowRight, type LucideProps } from 'lucide-react';

const sharedIconProps: LucideProps = {
  'aria-hidden': true,
  focusable: false,
  size: 18,
  strokeWidth: 2,
};

export function ArrowIcon() {
  return <ArrowRight {...sharedIconProps} className="ui-icon ui-icon-arrow" />;
}
