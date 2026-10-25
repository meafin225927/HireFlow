import React from 'react';
import * as Dialog from '@radix-ui/react-dialog'; // using Radix Dialog (or any dialog lib you have)

/**
 * Placeholder DeleteJobDialog used by EditJob page.
 * Props:
 *   jobTitle – title of the job (for display)
 *   busy – boolean indicating deletion in progress
 *   error – error message string (optional)
 *   onCancel – called when the user closes the dialog without confirming
 *   onConfirm – async function to delete the job
 */
export default function DeleteJobDialog({ jobTitle, busy, error, onCancel, onConfirm }) {
  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onCancel?.() }>
      <Dialog.Trigger asChild>
        {/* The trigger button is rendered in the parent; we keep this empty */}
        <span />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>Delete “{jobTitle}”?</Dialog.Title>
          <Dialog.Description>
            This action cannot be undone. Are you sure you want to permanently delete this job?
          </Dialog.Description>
          {error && <p className="error-message">{error}</p>}
          <div className="dialog-actions">
            <button className="button" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
            <button className="button button-danger" onClick={onConfirm} disabled={busy}>
              {busy ? 'Deleting…' : 'Delete'}
            </button>
          </div>
          <Dialog.Close asChild>
            <button className="icon-button" aria-label="Close">
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
