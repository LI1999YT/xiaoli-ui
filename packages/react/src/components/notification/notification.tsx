
export function Notification({ title, description, status = 'info', onClose }: { title: string; description?: string; status?: 'info' | 'success' | 'warning' | 'error'; onClose?: () => void; }) {
  return (
    <div data-dui="notification" data-status={status} role="status">
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      <button type="button" aria-label="关闭" onClick={onClose}>×</button>
    </div>
  );
}
