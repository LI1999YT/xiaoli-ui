import { useState, type ReactNode } from 'react';
import { presence } from '../../utils/dom';

export function Upload({ accept, multiple, disabled, onFilesChange }: { accept?: string; multiple?: boolean; disabled?: boolean; onFilesChange?: (files: File[]) => void; children?: ReactNode; }) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div data-dui="upload" data-disabled={presence(disabled)}>
      <label data-part="trigger">
        <input type="file" accept={accept} multiple={multiple} disabled={disabled} className="dui-visually-hidden" onChange={(e) => { const next = [...(e.target.files ?? [])]; setFiles(next); onFilesChange?.(next); }} />
        <span>选择文件</span>
      </label>
      <ul data-part="list">{files.map((file) => <li key={file.name}>{file.name}</li>)}</ul>
    </div>
  );
}
