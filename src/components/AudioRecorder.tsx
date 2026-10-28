import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Upload, Check, RefreshCw, AlertCircle } from 'lucide-react';
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
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(`Permissão de microfone negada ou não suportada: ${err.message}`);
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
      setErrorMessage(`Erro ao processar áudio com faster-whisper: ${err.message}`);
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
    <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mic size={18} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Gravação de Resposta (faster-whisper)</span>
        </div>
        {isRecording && (
          <span style={{ color: 'var(--accent-red)', fontWeight: 700, fontSize: '0.85rem' }}>
            ● Gravando: {formatTime(timerSeconds)}
          </span>
        )}
      </div>

      {isRecording && (
        <div className="waveform-bars" style={{ margin: '1.5rem 0' }}>
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{ animationDelay: `${(i % 5) * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {audioUrl && !isRecording && (
        <div style={{ margin: '1rem 0' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Pré-visualização do áudio:</p>
          <audio controls src={audioUrl} style={{ width: '100%', height: '40px' }} />
        </div>
      )}

      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontSize: '0.85rem', margin: '0.75rem 0' }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
        {!isRecording ? (
          <button className="btn btn-primary" onClick={startRecording} disabled={isUploading}>
            <Mic size={16} /> Iniciar Gravação
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopRecording}>
            <Square size={16} /> Finalizar Gravação
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
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isRecording || isUploading}
        >
          <Upload size={16} /> Enviar Arquivo de Áudio
        </button>

        {audioBlob && !isRecording && (
          <button
            className="btn btn-primary"
            onClick={submitAudioForTranscription}
            disabled={isUploading}
            style={{ marginLeft: 'auto' }}
          >
            {isUploading ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Transcrevendo com faster-whisper...
              </>
            ) : (
              <>
                <Check size={16} /> Transcrever Áudio
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
