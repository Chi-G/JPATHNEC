import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '../../../components/AppIcon';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {items?.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          )}
          {item?.href ? (
            <Link
              href={item?.href}
              className="hover:text-primary transition-colors"
            >
              {item?.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item?.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
