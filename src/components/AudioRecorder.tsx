import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Upload, Check, RefreshCw, AlertCircle, Volume2 } from 'lucide-react';
import { api } from '../services/api';
import { InterviewAnswer } from '../types';

interface AudioRecorderProps {
  sessionId: string;
  questionId: string;
  onTranscriptionComplete: (answer: InterviewAnswer) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  sessionId,
  questionId,
  onTranscriptionComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setErrorMessage(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setTimerSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(`Permissão de microfone negada ou indisponível: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const submitAudioForTranscription = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const answer = await api.submitAudioAnswer(sessionId, questionId, audioBlob);
      onTranscriptionComplete(answer);
    } catch (err: any) {
      setErrorMessage(`Não foi possível transcrever o áudio: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card p-4 rounded-base border border-border shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-brandOrange" />
          <span className="text-xs font-bold text-foreground">Gravação de Voz</span>
        </div>
        {isRecording && (
          <span className="text-xs font-bold text-red-600 flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            Gravando: {formatTime(timerSeconds)}
          </span>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center justify-center gap-1 py-3 bg-red-50/50 rounded-base border border-red-100">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-red-500 rounded-full animate-bounce"
              style={{
                height: `${12 + (i % 5) * 6}px`,
                animationDelay: `${(i % 5) * 0.12}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="space-y-1.5 p-2.5 bg-background rounded-base border border-border">
          <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-primary" /> Ouvir prévia gravada:
          </p>
          <audio controls src={audioUrl} className="w-full h-8" />
        </div>
      )}

      {errorMessage && (
        <div className="p-2.5 rounded-base bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={isUploading}
            className="px-3.5 py-1.5 bg-brandOrange hover:opacity-95 text-white text-xs font-bold rounded-base flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-all"
          >
            <Mic className="w-3.5 h-3.5" /> Começar a Gravar
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-base flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Square className="w-3.5 h-3.5" /> Concluir Gravação
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isRecording || isUploading}
          className="px-3 py-1.5 bg-background hover:bg-secondary/40 text-muted-foreground hover:text-foreground text-xs font-medium rounded-base border border-border flex items-center gap-1.5 disabled:opacity-50 transition-all"
        >
          <Upload className="w-3.5 h-3.5" /> Enviar Arquivo
        </button>

        {audioBlob && !isRecording && (
          <button
            type="button"
            onClick={submitAudioForTranscription}
            disabled={isUploading}
            className="ml-auto px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-all"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Transcrevendo com IA...
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" /> Transcrever Áudio
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
