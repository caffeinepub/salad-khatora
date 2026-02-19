import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Customer } from '../backend';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCustomers: Customer[];
  onSuccess?: () => void;
}

export default function NotificationDialog({
  open,
  onOpenChange,
  selectedCustomers,
  onSuccess,
}: NotificationDialogProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);

    try {
      // Simulate sending to each customer
      await new Promise(resolve => setTimeout(resolve, 1000));

      const count = selectedCustomers.length;
      toast.success(`Message sent to ${count} customer${count !== 1 ? 's' : ''}`);
      setMessage('');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Send a message to {selectedCustomers.length} selected customer{selectedCustomers.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Recipients ({selectedCustomers.length})</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50 max-h-32 overflow-y-auto">
              {selectedCustomers.map((customer) => (
                <Badge key={customer.id.toString()} variant="secondary">
                  {customer.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {message.length} characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !message.trim()}
            className="bg-fresh-600 hover:bg-fresh-700"
          >
            {isSending ? 'Sending...' : 'Send Notification'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
