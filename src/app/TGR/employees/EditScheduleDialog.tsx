import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
  employeeName: string;
  fetchWeeklySchedule: (employeeId: number) => Promise<WeeklySchedule>;
  onUpdateSchedule: (schedules: WeeklySchedule) => Promise<void>;
}

interface WeeklySchedule {
  [day: string]: { start_time: string | null; end_time: string | null };
}

export function EditScheduleDialog({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  fetchWeeklySchedule,
  onUpdateSchedule,
}: EditScheduleDialogProps) {
  const [schedules, setSchedules] = useState<WeeklySchedule>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSchedule();
    }
  }, [isOpen]);

  const loadSchedule = async () => {
    const weeklySchedule = await fetchWeeklySchedule(employeeId);
    setSchedules(weeklySchedule);
  };

  const formatTime = (time: string | null): string => {
    if (!time) return "";
    const date = parse(time, "HH:mm:ss", new Date());
    return format(date, "h:mm a");
  };

  const parseTime = (time: string): string | null => {
    if (!time) return null;
    const date = parse(time, "h:mm a", new Date());
    return format(date, "HH:mm:ss");
  };

  const handleInputChange = (
    day: string,
    field: "start_time" | "end_time",
    value: string
  ) => {
    setSchedules((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: parseTime(value) },
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onUpdateSchedule(schedules);
      onClose();
    } catch (error) {
      console.error("Error updating schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-2">
        <DialogHeader>
          <DialogTitle>Edit Schedule for {employeeName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(schedules).map(([day, times]) => (
            <div key={day} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={`${day}-start`} className="text-right">
                {day}
              </Label>
              <Input
                id={`${day}-start`}
                value={formatTime(times.start_time)}
                onChange={(e) =>
                  handleInputChange(day, "start_time", e.target.value)
                }
                placeholder="Start Time"
              />
              <Input
                id={`${day}-end`}
                value={formatTime(times.end_time)}
                onChange={(e) =>
                  handleInputChange(day, "end_time", e.target.value)
                }
                placeholder="End Time"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="linkHover2" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="linkHover1"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
