
"use client";

import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TextToSpeechProps {
  textToSpeak: string;
  ariaLabel?: string;
}

export function TextToSpeech({ textToSpeak, ariaLabel }: TextToSpeechProps) {
  const { toast } = useToast();

  const handleSpeak = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        variant: "destructive",
        title: "TTS Not Supported",
        description: "Sorry, your browser doesn't support text-to-speech.",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      className="h-6 w-6 text-muted-foreground hover:text-foreground"
      aria-label={ariaLabel || `Read text aloud: ${textToSpeak}`}
    >
      <Volume2 className="h-4 w-4" />
    </Button>
  );
}
