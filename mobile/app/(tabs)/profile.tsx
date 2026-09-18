import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { CEFRLevel } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { NeuCard } from '../../components/ui/NeuCard';
import { ApiService } from '../../services/api';
import { HapticService } from '../../services/haptics';
import {
  User,
  Sliders,
  Volume2,
  Database,
  Trash2,
  Download,
  Info,
  Check,
  Server,
  RefreshCw,
  Sparkles,
  Moon,
  Sun,
  Vibrate,
} from 'lucide-react-native';

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SPEECH_RATES = [0.8, 0.9, 1.0, 1.1, 1.2];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setLevel, saveUser } = useUserStore();
  const { settings, updateSetting, clearAllData, exportData } = useSettingsStore();

  const [backendUrl, setBackendUrl] = useState(settings.backend_url || '');
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedJson, setExportedJson] = useState('');

  useEffect(() => {
    setBackendUrl(settings.backend_url || '');
  }, [settings.backend_url]);

  const handleTestConnection = async () => {
    setIsTestingApi(true);
    setConnectionStatus(null);
    try {
      await updateSetting('backend_url', backendUrl.trim());
      const res = await ApiService.checkHealth();
      if (res.status === 'healthy') {
        setConnectionStatus(`Connected (AI Ready: ${res.ai_ready ? 'Yes' : 'Simulation fallback'})`);
      } else {
        setConnectionStatus('Backend reachable, offline mode');
      }
    } catch {
      setConnectionStatus('Could not connect to backend');
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleClearData = async () => {
    await clearAllData();
    setShowClearModal(false);
    Alert.alert('Data Cleared', 'All local SQLite data has been cleared.');
    router.replace('/onboarding');
  };

  const handleExport = async () => {
    const json = await exportData();
    setExportedJson(json);
    setShowExportModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings & Profile</Text>
          <Text style={styles.subtitle}>Learning preferences & local database controls</Text>
        </View>

        {/* User Card */}
        <NeuCard variant="raised" style={styles.card}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(user?.name || 'U').charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
              <Text style={styles.userGoal}>{user?.goal || 'General English Fluency'}</Text>
            </View>
            <Badge label={user?.level || 'B1'} variant="accent" />
          </View>
        </NeuCard>

        {/* CEFR Level Selection */}
        <NeuCard variant="raised" style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Sliders size={18} color={Colors.primaryAccent} />
            <Text style={styles.cardSectionTitle}>TARGET CEFR LEVEL</Text>
          </View>
          <Text style={styles.hintText}>
            TalkTune adapts conversation speed and correction strictness according to your level.
          </Text>

          <View style={styles.levelSelector}>
            {CEFR_LEVELS.map((lvl) => {
              const isSelected = user?.level === lvl;
              return (
                <TouchableOpacity
                  key={lvl}
                  activeOpacity={0.8}
                  onPress={() => setLevel(lvl)}
                  style={[
                    styles.levelPill,
                    isSelected ? styles.levelPillActive : styles.levelPillIdle,
                  ]}
                >
                  <Text
                    style={[
                      styles.levelPillText,
                      isSelected ? styles.levelPillTextActive : styles.levelPillTextIdle,
                    ]}
                  >
                    {lvl}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </NeuCard>

        {/* Speech & Audio Settings */}
        <NeuCard variant="raised" style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Volume2 size={18} color={Colors.primaryAccent} />
            <Text style={styles.cardSectionTitle}>SPEECH PLAYBACK SPEED</Text>
          </View>
          <Text style={styles.hintText}>Control how fast TalkTune reads responses aloud.</Text>

          <View style={styles.rateSelector}>
            {SPEECH_RATES.map((rate) => {
              const isSelected = settings.speech_rate === rate;
              return (
                <TouchableOpacity
                  key={rate}
                  activeOpacity={0.8}
                  onPress={() => {
                    HapticService.selection();
                    updateSetting('speech_rate', rate);
                  }}
                  style={[
                    styles.ratePill,
                    isSelected ? styles.ratePillActive : styles.ratePillIdle,
                  ]}
                >
                  <Text
                    style={[
                      styles.ratePillText,
                      isSelected ? styles.ratePillTextActive : styles.ratePillTextIdle,
                    ]}
                  >
                    {rate}x
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </NeuCard>

        {/* Appearance & Tactile Haptics */}
        <NeuCard variant="raised" style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Sparkles size={18} color={Colors.primaryAccent} />
            <Text style={styles.cardSectionTitle}>APPEARANCE & TACTILE FEEL</Text>
          </View>
          <Text style={styles.hintText}>
            Personalize your tactile interface and visual lighting.
          </Text>

          {/* Dark Mode Switch */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <View style={styles.toggleIconContainer}>
                {settings.dark_mode ? (
                  <Moon size={18} color={Colors.primaryAccent} />
                ) : (
                  <Sun size={18} color={Colors.primaryAccent} />
                )}
              </View>
              <View>
                <Text style={styles.toggleTitle}>Dark Titanium Theme</Text>
                <Text style={styles.toggleSubtitle}>
                  {settings.dark_mode ? 'Graphite charcoal palette' : 'Soft Neumorphic canvas'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              accessibilityRole="switch"
              accessibilityLabel="Dark Titanium Theme"
              accessibilityState={{ checked: !!settings.dark_mode }}
              activeOpacity={0.8}
              onPress={() => {
                HapticService.impactMedium();
                updateSetting('dark_mode', !settings.dark_mode);
              }}
              style={[
                styles.switchPill,
                settings.dark_mode ? styles.switchPillActive : styles.switchPillIdle,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  settings.dark_mode && styles.switchThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Haptic Feedback Switch */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <View style={styles.toggleIconContainer}>
                <Vibrate size={18} color={Colors.primaryAccent} />
              </View>
              <View>
                <Text style={styles.toggleTitle}>Tactile Haptic Feedback</Text>
                <Text style={styles.toggleSubtitle}>Micro-vibrations on button press</Text>
              </View>
            </View>

            <TouchableOpacity
              accessibilityRole="switch"
              accessibilityLabel="Tactile Haptic Feedback"
              accessibilityState={{ checked: !!settings.haptic_feedback }}
              activeOpacity={0.8}
              onPress={() => {
                const next = !settings.haptic_feedback;
                if (next) HapticService.impactLight();
                updateSetting('haptic_feedback', next);
              }}
              style={[
                styles.switchPill,
                settings.haptic_feedback ? styles.switchPillActive : styles.switchPillIdle,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  settings.haptic_feedback && styles.switchThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </NeuCard>

        {/* Backend & AI Connection */}
        <NeuCard variant="raised" style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Server size={18} color={Colors.primaryAccent} />
            <Text style={styles.cardSectionTitle}>BACKEND AI SERVER</Text>
          </View>
          <Text style={styles.hintText}>
            FastAPI / Gemini endpoint for live grammar correction & dialogue.
          </Text>

          {/* Sunken Input Box */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={backendUrl}
              onChangeText={setBackendUrl}
              placeholder="http://192.168.1.X:8000"
              placeholderTextColor={Colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Button
            title={isTestingApi ? 'Connecting...' : 'Test Connection'}
            onPress={handleTestConnection}
            variant="secondary"
            loading={isTestingApi}
            icon={<RefreshCw size={16} color={Colors.onSurface} />}
            iconPosition="left"
          />

          {connectionStatus && (
            <View style={styles.statusBox}>
              <Info size={14} color={Colors.primaryAccent} />
              <Text style={styles.statusText}>{connectionStatus}</Text>
            </View>
          )}
        </NeuCard>

        {/* Local Storage & Privacy */}
        <NeuCard variant="raised" style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Database size={18} color={Colors.primaryAccent} />
            <Text style={styles.cardSectionTitle}>LOCAL DATA MANAGEMENT</Text>
          </View>
          <Text style={styles.hintText}>
            All conversation logs, mistakes, and vocabulary are stored locally on your device via SQLite.
          </Text>

          <View style={styles.actionCol}>
            <Button
              title="Export Data (JSON)"
              onPress={handleExport}
              variant="secondary"
              icon={<Download size={16} color={Colors.onSurface} />}
              iconPosition="left"
            />
            <Button
              title="Clear All Local Data"
              onPress={() => setShowClearModal(true)}
              variant="danger"
              icon={<Trash2 size={16} color={Colors.onErrorContainer} />}
              iconPosition="left"
            />
          </View>
        </NeuCard>

        {/* Clear Data Confirmation Modal */}
        <Modal visible={showClearModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <NeuCard variant="raisedLg" style={styles.modalCard}>
              <Text style={styles.modalTitle}>Clear All Data?</Text>
              <Text style={styles.modalBody}>
                This will permanently delete all session transcripts, recorded mistakes, and vocabulary words from this device.
              </Text>
              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => setShowClearModal(false)}
                  style={styles.modalBtn}
                />
                <Button
                  title="Yes, Delete"
                  variant="danger"
                  onPress={handleClearData}
                  style={styles.modalBtn}
                />
              </View>
            </NeuCard>
          </View>
        </Modal>

        {/* Export JSON Modal */}
        <Modal visible={showExportModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <NeuCard variant="raisedLg" style={styles.modalCard}>
              <Text style={styles.modalTitle}>Exported Local Data</Text>
              <View style={styles.jsonBox}>
                <ScrollView showsVerticalScrollIndicator>
                  <Text style={styles.jsonText}>{exportedJson}</Text>
                </ScrollView>
              </View>
              <Button
                title="Close"
                variant="primary"
                onPress={() => setShowExportModal(false)}
              />
            </NeuCard>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    padding: Spacing.margin,
    gap: Spacing.lg,
    paddingBottom: 40,
  },
  header: {
    paddingTop: Spacing.xs,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
    marginTop: 2,
  },
  card: {
    padding: Spacing.lg,
    gap: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    ...NeuShadows.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.headlineSm,
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  userGoal: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardSectionTitle: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  hintText: {
    ...Typography.bodySm,
    color: Colors.secondary,
    lineHeight: 19,
  },
  levelSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  levelPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelPillIdle: {
    ...NeuShadows.raisedSm,
  },
  levelPillActive: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSunken,
  },
  levelPillText: {
    ...Typography.labelMd,
  },
  levelPillTextIdle: {
    color: Colors.onSurface,
    fontWeight: '600',
  },
  levelPillTextActive: {
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  rateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  ratePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratePillIdle: {
    ...NeuShadows.raisedSm,
  },
  ratePillActive: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSunken,
  },
  ratePillText: {
    ...Typography.labelMd,
  },
  ratePillTextIdle: {
    color: Colors.onSurface,
    fontWeight: '600',
  },
  ratePillTextActive: {
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  inputContainer: {
    ...NeuShadows.sunken,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  statusText: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    flex: 1,
  },
  actionCol: {
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    padding: Spacing.xl,
    gap: 16,
  },
  modalTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  modalBody: {
    ...Typography.bodyMd,
    color: Colors.secondary,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
  },
  jsonBox: {
    ...NeuShadows.sunken,
    borderRadius: Radius.md,
    height: 180,
    padding: 12,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: Colors.onSurface,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(163, 177, 198, 0.2)',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleIconContainer: {
    ...NeuShadows.raisedSm,
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTitle: {
    ...Typography.bodyMd,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  toggleSubtitle: {
    ...Typography.labelSm,
    color: Colors.muted,
    marginTop: 1,
  },
  switchPill: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  switchPillIdle: {
    ...NeuShadows.sunken,
  },
  switchPillActive: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  switchThumb: {
    ...NeuShadows.raisedSm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
  },
});
