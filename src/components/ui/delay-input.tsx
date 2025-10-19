"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_DELAY_MS } from "@/lib/validations";

// Maximum delay in seconds
const MAX_DELAY_SECONDS = MAX_DELAY_MS / 1000;

interface DelayInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function DelayInput({ value, onChange, error }: DelayInputProps) {
  const [ms, setMs] = useState<string>(value.toString());
  const [seconds, setSeconds] = useState<string>((value / 1000).toString());

  // Sync with external value changes
  useEffect(() => {
    setMs(value.toString());
    setSeconds((value / 1000).toFixed(3).replace(/\.?0+$/, ""));
  }, [value]);

  const handleMsChange = (newMs: string) => {
    // Allow empty string for editing
    if (newMs === "") {
      setMs("");
      setSeconds("");
      onChange(0);
      return;
    }

    const msValue = parseFloat(newMs);
    if (!isNaN(msValue) && msValue >= 0) {
      // Prevent exceeding maximum
      if (msValue > MAX_DELAY_MS) {
        setMs(MAX_DELAY_MS.toString());
        setSeconds(MAX_DELAY_SECONDS.toString());
        onChange(MAX_DELAY_MS);
        return;
      }

      const roundedValue = Math.round(msValue);
      setMs(newMs); // Keep the user's input
      onChange(roundedValue);
      setSeconds((roundedValue / 1000).toFixed(3).replace(/\.?0+$/, ""));
    }
  };

  const handleSecondsChange = (newSeconds: string) => {
    // Allow empty string for editing
    if (newSeconds === "") {
      setSeconds("");
      setMs("");
      onChange(0);
      return;
    }

    const secondsValue = parseFloat(newSeconds);
    if (!isNaN(secondsValue) && secondsValue >= 0) {
      // Prevent exceeding maximum
      if (secondsValue > MAX_DELAY_SECONDS) {
        setSeconds(MAX_DELAY_SECONDS.toString());
        setMs(MAX_DELAY_MS.toString());
        onChange(MAX_DELAY_MS);
        return;
      }

      const msValue = Math.round(secondsValue * 1000);
      setSeconds(newSeconds); // Keep the user's input
      onChange(msValue);
      setMs(msValue.toString());
    }
  };

  return (
    <div className="space-y-2">
      <Label>Delay (max {MAX_DELAY_SECONDS}s / {MAX_DELAY_MS}ms)</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="delay-ms" className="text-xs text-gray-600">
            Milliseconds
          </Label>
          <Input
            id="delay-ms"
            type="number"
            min="0"
            max={MAX_DELAY_MS}
            placeholder="0"
            value={ms}
            onChange={(e) => handleMsChange(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="delay-seconds" className="text-xs text-gray-600">
            Seconds
          </Label>
          <Input
            id="delay-seconds"
            type="number"
            min="0"
            max={MAX_DELAY_SECONDS}
            step="0.001"
            placeholder="0"
            value={seconds}
            onChange={(e) => handleSecondsChange(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
