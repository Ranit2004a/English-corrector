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
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { usePracticeStore } from '../../store/usePracticeStore';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { AudioWaveform } from '../../components/ui/AudioWaveform';
import { SpeechService } from '../../services/speech';
import {
  ArrowLeft,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Keyboard,
  PhoneOff,
  Send,
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

  const handleToggleVoice = () => {
    if (practiceState === 'LISTENING') {
      // User tapped to finish speaking
      SpeechService.stopListening();
      setPracticeState('IDLE');
    } else if (practiceState === 'IDLE') {
      // Start listening
      SpeechService.startListening({
        onStart: () => {
          setPracticeState('LISTENING');
        },
        onResult: (transcript) => {
          if (transcript && transcript.trim()) {
            sendMessage(transcript);
          }
        },
        onError: (err) => {
          console.warn('Voice recognition error:', err);
          setPracticeState('IDLE');
        },
        onEnd: () => {
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
        return 'Listening... Tap to finish';
      case 'PROCESSING':
        return 'Analyzing your English...';
      case 'AI_SPEAKING':
        return 'Echo is speaking...';
      case 'ERROR':
        return errorMessage || 'Error occurred';
      default:
        return 'Tap microphone to speak';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Minimal Monochrome Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (messages.length > 1) {
                handleEndSession();
              } else {
                resetSession();
                router.back();
              }
            }}
          >
            <ArrowLeft size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View>
            <Text style={styles.topicTitle}>{currentSession?.topic || 'Daily Conversation'}</Text>
            <Text style={styles.topicSub}>Echo AI Speaking Coach</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.timerPill}>
            <View style={styles.timerDot} />
            <Text style={styles.timerText}>{formatTimer(timerSeconds)}</Text>
          </View>

          <TouchableOpacity style={styles.endHeaderBtn} onPress={handleEndSession}>
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
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.processingText}>Echo is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Interaction Dock Area */}
      <View style={styles.interactionDock}>
        {/* Audio Rhythm Bar */}
        <AudioWaveform
          active={practiceState === 'LISTENING' || practiceState === 'AI_SPEAKING'}
        />

        {/* Tactile Microphone Trigger */}
        <View style={styles.micContainer}>
          <View
            style={[
              styles.micOuterRing,
              practiceState === 'LISTENING' && styles.micOuterRingActive,
            ]}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.micButton,
              practiceState === 'LISTENING' && styles.micButtonListening,
              practiceState === 'PROCESSING' && styles.micButtonProcessing,
            ]}
            onPress={handleToggleVoice}
            disabled={practiceState === 'PROCESSING'}
          >
            {practiceState === 'LISTENING' ? (
              <Square size={26} color={Colors.onPrimary} fill={Colors.onPrimary} />
            ) : (
              <Mic size={30} color={Colors.onPrimary} />
            )}
          </TouchableOpacity>
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
              placeholder="Type your response in English..."
              placeholderTextColor={Colors.muted}
              onSubmitEditing={handleSendTypedMessage}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendTypedMessage}
              disabled={!textInput.trim()}
            >
              <Send size={16} color={Colors.onPrimary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Minimal Utility Row */}
        <View style={styles.utilityRow}>
          <TouchableOpacity style={styles.utilityBtn} onPress={toggleMute}>
            {isMuted ? (
              <VolumeX size={17} color={Colors.onSurface} />
            ) : (
              <Volume2 size={17} color={Colors.onSurface} />
            )}
            <Text style={styles.utilityText}>{isMuted ? 'Muted' : 'Mute'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.utilityBtn}
            onPress={() => setShowKeyboardDrawer(!showKeyboardDrawer)}
          >
            <Keyboard size={17} color={Colors.onSurface} />
            <Text style={styles.utilityText}>Type</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.utilityBtn} onPress={handleEndSession}>
            <PhoneOff size={17} color={Colors.error} />
            <Text style={[styles.utilityText, { color: Colors.error }]}>End</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.margin,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    backgroundColor: Colors.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTitle: {
    ...Typography.labelLg,
    color: Colors.onSurface,
  },
  topicSub: {
    ...Typography.labelSm,
    fontSize: 11,
    color: Colors.muted,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  timerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  timerText: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  endHeaderBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  endHeaderText: {
    ...Typography.labelMd,
    color: Colors.muted,
    fontWeight: '600',
  },
  dialogueContainer: {
    padding: Spacing.margin,
    paddingBottom: 24,
    gap: 8,
  },
  processingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    marginTop: 4,
  },
  processingText: {
    ...Typography.bodySm,
    color: Colors.muted,
    fontStyle: 'italic',
  },
  interactionDock: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: Spacing.margin,
    alignItems: 'center',
    gap: 10,
  },
  micContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micOuterRing: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  micOuterRingActive: {
    borderColor: Colors.primary,
    transform: [{ scale: 1.08 }],
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  micButtonListening: {
    backgroundColor: '#1f2937',
  },
  micButtonProcessing: {
    backgroundColor: Colors.muted,
  },
  micHintText: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  micHintTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  keyboardDrawer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    marginTop: 4,
  },
  drawerInput: {
    flex: 1,
    height: 42,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    ...Typography.bodySm,
    color: Colors.onSurface,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceSubtle,
  },
  utilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
  },
  utilityText: {
    ...Typography.labelMd,
    color: Colors.onSurface,
  },
});
