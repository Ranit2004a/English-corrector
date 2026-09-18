import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { usePracticeStore } from '../../store/usePracticeStore';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { AudioWaveform } from '../../components/ui/AudioWaveform';
import { NeuIconButton } from '../../components/ui/NeuIconButton';
import { SpeechService } from '../../services/speech';
import { AudioRecorderService } from '../../services/audioRecorder';
import { HapticService } from '../../services/haptics';
import {
  ArrowLeft,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Keyboard,
  PhoneOff,
  Send,
  Sparkles,
} from 'lucide-react-native';

export default function PracticeSessionScreen() {
  const router = useRouter();
  const {
    currentSession,
    practiceState,
    messages,
    corrections,
    timerSeconds,
    isMuted,
    errorMessage,
    sendMessage,
    endSession,
    setPracticeState,
    toggleMute,
    incrementTimer,
    resetSession,
  } = usePracticeStore();

  const [textInput, setTextInput] = useState('');
  const [showKeyboardDrawer, setShowKeyboardDrawer] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      incrementTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, practiceState]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleVoice = async () => {
    HapticService.impactMedium();
    if (practiceState === 'LISTENING') {
      SpeechService.stopListening();
      const audioUri = await AudioRecorderService.stopRecording();
      setPracticeState('IDLE');
    } else if (practiceState === 'IDLE') {
      // Start recording user audio
      await AudioRecorderService.startRecording();

      SpeechService.startListening({
        onStart: () => {
          setPracticeState('LISTENING');
        },
        onResult: async (transcript) => {
          const audioUri = await AudioRecorderService.stopRecording();
          if (transcript && transcript.trim()) {
            HapticService.notificationSuccess();
            sendMessage(transcript, audioUri || undefined);
          }
        },
        onError: async (err) => {
          console.warn('Voice recognition error:', err);
          await AudioRecorderService.stopRecording();
          setPracticeState('IDLE');
        },
        onEnd: async () => {
          if (AudioRecorderService.getIsRecording()) {
            await AudioRecorderService.stopRecording();
          }
          setPracticeState('IDLE');
        },
      });
    }
  };

  const handleSendTypedMessage = () => {
    if (!textInput.trim()) return;
    const text = textInput.trim();
    setTextInput('');
    sendMessage(text);
  };

  const handleEndSession = () => {
    Alert.alert(
      'End Practice Session?',
      'Are you ready to complete this session and review your speaking feedback?',
      [
        { text: 'Keep Speaking', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: async () => {
            SpeechService.stopListening();
            await AudioRecorderService.stopRecording();
            await AudioRecorderService.stopAudio();
            const summary = await endSession();
            if (summary) {
              router.replace('/practice/summary');
            } else {
              router.replace('/(tabs)');
            }
          },
        },
      ]
    );
  };

  const getMicStatusHint = () => {
    switch (practiceState) {
      case 'LISTENING':
        return 'Listening... Tap to send';
      case 'PROCESSING':
        return 'Analyzing pronunciation & grammar...';
      case 'AI_SPEAKING':
        return 'TalkTune is speaking...';
      case 'ERROR':
        return errorMessage || 'Error occurred';
      default:
        return 'Tap microphone to speak';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Neumorphic Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <NeuIconButton
            icon={<ArrowLeft size={18} color={Colors.onSurface} />}
            accessibilityLabel="Go back"
            size={40}
            onPress={() => {
              if (messages.length > 1) {
                handleEndSession();
              } else {
                resetSession();
                router.back();
              }
            }}
          />
          <View style={styles.titleColumn}>
            <Text style={styles.topicTitle} numberOfLines={1}>
              {currentSession?.topic || 'Daily Conversation'}
            </Text>
            <Text style={styles.topicSub}>TalkTune AI Coach</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.timerPill}>
            <View style={styles.timerDot} />
            <Text style={styles.timerText}>{formatTimer(timerSeconds)}</Text>
          </View>

          <TouchableOpacity
            style={styles.endHeaderBtn}
            onPress={handleEndSession}
            activeOpacity={0.8}
          >
            <Text style={styles.endHeaderText}>End</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Message Dialogue Thread */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.dialogueContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const msgCorrections = corrections.filter((c) => c.message_id === msg.id);
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              corrections={msgCorrections}
            />
          );
        })}

        {/* Processing Indicator */}
        {practiceState === 'PROCESSING' && (
          <View style={styles.processingBubble}>
            <ActivityIndicator size="small" color={Colors.primaryAccent} />
            <Text style={styles.processingText}>TalkTune is analyzing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Neumorphic Bottom Interaction Dock */}
      <View style={styles.interactionDock}>
        {/* Audio Rhythm Bar */}
        <AudioWaveform
          active={practiceState === 'LISTENING' || practiceState === 'AI_SPEAKING'}
        />

        {/* Grand 3D Neumorphic Microphone */}
        <View style={styles.micWrapper}>
          <View
            style={[
              styles.micGlowRing,
              practiceState === 'LISTENING' && styles.micGlowRingListening,
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.88}
              style={[
                styles.micButton,
                practiceState === 'LISTENING'
                  ? styles.micButtonListening
                  : styles.micButtonIdle,
              ]}
              onPress={handleToggleVoice}
              disabled={practiceState === 'PROCESSING'}
            >
              {practiceState === 'LISTENING' ? (
                <Square size={28} color={Colors.onPrimary} fill={Colors.onPrimary} />
              ) : (
                <Mic size={32} color={Colors.onPrimaryAccent} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={[
            styles.micHintText,
            practiceState === 'LISTENING' && styles.micHintTextActive,
          ]}
        >
          {getMicStatusHint()}
        </Text>

        {/* Quick Type Drawer (Optional text fallback) */}
        {showKeyboardDrawer && (
          <View style={styles.keyboardDrawer}>
            <TextInput
              style={styles.drawerInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder="Type your answer in English..."
              placeholderTextColor={Colors.muted}
              onSubmitEditing={handleSendTypedMessage}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendTypedMessage}
              disabled={!textInput.trim()}
              activeOpacity={0.8}
            >
              <Send size={16} color={Colors.onPrimaryAccent} />
            </TouchableOpacity>
          </View>
        )}

        {/* Minimal Utility Row */}
        <View style={styles.utilityRow}>
          <TouchableOpacity
            style={[styles.utilityBtn, isMuted && styles.utilityBtnActive]}
            onPress={toggleMute}
            activeOpacity={0.8}
          >
            {isMuted ? (
              <VolumeX size={16} color={Colors.primaryAccent} />
            ) : (
              <Volume2 size={16} color={Colors.onSurface} />
            )}
            <Text style={[styles.utilityText, isMuted && styles.utilityTextActive]}>
              {isMuted ? 'Muted' : 'Mute'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.utilityBtn, showKeyboardDrawer && styles.utilityBtnActive]}
            onPress={() => setShowKeyboardDrawer(!showKeyboardDrawer)}
            activeOpacity={0.8}
          >
            <Keyboard
              size={16}
              color={showKeyboardDrawer ? Colors.primaryAccent : Colors.onSurface}
            />
            <Text
              style={[
                styles.utilityText,
                showKeyboardDrawer && styles.utilityTextActive,
              ]}
            >
              Type
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.utilityBtn, styles.utilityBtnEnd]}
            onPress={handleEndSession}
            activeOpacity={0.8}
          >
            <PhoneOff size={16} color={Colors.error} />
            <Text style={[styles.utilityText, styles.utilityTextEnd]}>End</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  titleColumn: {
    flex: 1,
    gap: 1,
  },
  topicTitle: {
    ...Typography.headlineSm,
    fontSize: 16,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  topicSub: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    ...NeuShadows.sunken,
  },
  timerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  timerText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  endHeaderBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    ...NeuShadows.raisedSm,
    backgroundColor: Colors.errorContainer,
  },
  endHeaderText: {
    ...Typography.labelSm,
    color: Colors.onErrorContainer,
    fontWeight: '800',
  },
  dialogueContainer: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: Spacing.margin,
    paddingTop: 10,
    paddingBottom: 24,
  },
  processingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    ...NeuShadows.raisedSm,
    marginVertical: 8,
  },
  processingText: {
    ...Typography.bodySm,
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  interactionDock: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: Colors.neuDarkDeep,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 16,
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: Spacing.margin,
    gap: 12,
    alignItems: 'center',
  },
  micWrapper: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micGlowRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    ...NeuShadows.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micGlowRingListening: {
    shadowColor: Colors.primaryAccent,
    shadowRadius: 20,
    shadowOpacity: 0.8,
    borderColor: Colors.primaryAccent,
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonIdle: {
    backgroundColor: Colors.primaryAccent,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  micButtonListening: {
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  micHintText: {
    ...Typography.labelMd,
    color: Colors.muted,
    fontWeight: '600',
  },
  micHintTextActive: {
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
  keyboardDrawer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    ...NeuShadows.sunken,
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  drawerInput: {
    flex: 1,
    height: 44,
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 4,
  },
  utilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    ...NeuShadows.raisedSm,
  },
  utilityBtnActive: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSunken,
  },
  utilityBtnEnd: {
    backgroundColor: Colors.errorContainer,
  },
  utilityText: {
    ...Typography.labelSm,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  utilityTextActive: {
    color: Colors.primaryAccent,
  },
  utilityTextEnd: {
    color: Colors.onErrorContainer,
  },
});
