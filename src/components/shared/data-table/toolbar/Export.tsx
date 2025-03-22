import { Dropdown } from '@/components/shared/Dropdown';
import { Button } from '@/components/ui/button';
import { ExportFileFormats } from '..';
import { Download } from 'lucide-react';

type ExportProps = {
  /** Callback function triggered when an export format is selected
   * @param {ExportFileFormats} value The selected export format
   */
  onExport: (value: ExportFileFormats) => void;
};

/**
 * A dropdown component that provides data export options.
 * Supports exporting table data to JSON or CSV formats.
 */
const Export = ({ onExport }: ExportProps) => {
  return (
    <Dropdown
      options={[
        { label: 'Json', value: 'json', onClick: () => onExport('json') },
        { label: 'CSV', value: 'csv', onClick: () => onExport('csv') },
      ]}
      triggerButton={
        <Button className="pl-2" variant="secondary">
          <Download className="size-6" />
          Export
        </Button>
      }
    />
  );
};

export { Export };
