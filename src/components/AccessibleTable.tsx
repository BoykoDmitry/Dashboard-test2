import React from 'react';
import { Table } from 'react-bootstrap';

interface AccessibleTableProps {
  children: React.ReactNode;
  caption?: string;
  className?: string;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  responsive?: boolean;
}

const AccessibleTable: React.FC<AccessibleTableProps> = ({
  children,
  caption,
  className = '',
  striped = true,
  bordered = false,
  hover = true,
  responsive = true
}) => {
  return (
    <Table
      striped={striped}
      bordered={bordered}
      hover={hover}
      responsive={responsive}
      className={className}
      role="table"
      aria-label={caption || "Data table"}
    >
      {caption && <caption className="sr-only">{caption}</caption>}
      {children}
    </Table>
  );
};

export default AccessibleTable;