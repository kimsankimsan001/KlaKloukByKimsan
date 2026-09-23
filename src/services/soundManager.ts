import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

class SoundManager {
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private hapticsEnabled: boolean = true;
  private audioCtx: any = null;
  private bgmInterval: any = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startAmbientBgm();
    } else {
      this.stopAmbientBgm();
    }
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
  }

  private triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning') {
    if (!this.hapticsEnabled) return;
    try {
      if (Platform.OS !== 'web') {
        if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        else if (type === 'heavy') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        else if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        else if (type === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch {
      // Haptics optional fallback
    }
  }

  // --- Sound Effects ---

  public playButtonClick() {
    this.triggerHaptic('light');
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  public playChipBet() {
    this.triggerHaptic('light');
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    try {
      const now = this.audioCtx.currentTime;
      // High ceramic clink
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playDiceShake(durationMs: number = 1800) {
    this.triggerHaptic('medium');
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    try {
      const startTime = this.audioCtx.currentTime;
      const count = Math.floor(durationMs / 90);

      for (let i = 0; i < count; i++) {
        const hitTime = startTime + i * 0.09 + Math.random() * 0.02;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        // Wooden rattle frequencies
        const freq = 180 + Math.random() * 260;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, hitTime);
        osc.frequency.exponentialRampToValueAtTime(60, hitTime + 0.04);

        gain.gain.setValueAtTime(0.12 + Math.random() * 0.08, hitTime);
        gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.04);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(hitTime);
        osc.stop(hitTime + 0.045);
      }
    } catch {}
  }

  public playDiceReveal(diceIndex: number) {
    this.triggerHaptic('heavy');
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    try {
      const now = this.audioCtx.currentTime;
      // Resonant wood thud + chime
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const baseFreq = 220 + diceIndex * 70;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  public playWinFanfare() {
    this.triggerHaptic('success');
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    try {
      const now = this.audioCtx.currentTime;
      // Traditional festive arpeggio (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const noteTime = now + idx * 0.12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.3, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    } catch {}
  }

  public playLoseSound() {
    this.triggerHaptic('warning');
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    try {
      const now = this.audioCtx.currentTime;
      const notes = [392.0, 329.63, 261.63]; // G4, E4, C4 descending
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const noteTime = now + idx * 0.15;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.22);
      });
    } catch {}
  }

  public startAmbientBgm() {
    if (!this.musicEnabled || !this.audioCtx || this.bgmInterval) return;
    this.ensureAudioContext();

    // Gentle Cambodian pentatonic motif playing softly in background
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0]; // C D E G A
    let step = 0;

    this.bgmInterval = setInterval(() => {
      if (!this.musicEnabled || !this.audioCtx) return;
      try {
        const freq = scale[step % scale.length];
        step = (step + 1) % scale.length;
        const now = this.audioCtx.currentTime;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      } catch {}
    }, 1400);
  }

  public stopAmbientBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const Sound = new SoundManager();
