import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  type LucideProps,
} from 'lucide-react';

const sharedIconProps: LucideProps = {
  'aria-hidden': true,
  focusable: false,
  size: 18,
  strokeWidth: 2,
};

export function ArrowIcon() {
  return <ArrowRight {...sharedIconProps} className="ui-icon ui-icon-arrow" />;
}

export function MenuIcon({ open }: { open: boolean }) {
  const Icon = open ? X : Menu;
  return <Icon {...sharedIconProps} className="ui-icon ui-icon-menu" />;
}

export function ExpandIcon() {
  return <ChevronDown {...sharedIconProps} className="ui-icon ui-icon-expand" />;
}
