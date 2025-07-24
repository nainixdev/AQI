import React, { useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { AQIResponse } from '@shared/schema';
import { translations, type Language } from '@/lib/translations';

interface VoiceAssistantProps {
  aqiData?: AQIResponse;
  location: string;
  language: Language;
}

export function VoiceAssistant({ aqiData, location, language }: VoiceAssistantProps) {
  const [speaking, setSpeaking] = useState(false);
  const { toast } = useToast();
  const t = translations[language];

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Error",
        description: t.speechNotSupported,
        variant: "destructive"
      });
      return;
    }

    if (!aqiData) {
      toast({
        title: "Error",
        description: "No air quality data available to read",
        variant: "destructive"
      });
      return;
    }

    const aqiStatus = t[aqiData.status as keyof typeof t] || aqiData.status;
    
    const text = language === 'hi' 
      ? `${location} में वर्तमान वायु गुणवत्ता सूचकांक ${aqiData.aqi} है, जो ${aqiStatus} है।`
      : `Current air quality index in ${location} is ${aqiData.aqi}, which is ${aqiStatus}.`;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      toast({
        title: "Error",
        description: "Failed to speak. Please try again.",
        variant: "destructive"
      });
    };

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <Button
      onClick={speaking ? stopSpeaking : speak}
      className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
      title={speaking ? "Stop speaking" : "Read AQI aloud"}
    >
      {speaking ? (
        <Volume2 className="h-4 w-4 animate-pulse" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
