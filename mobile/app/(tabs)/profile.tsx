import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { CEFRLevel } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { ApiService } from '../../services/api';
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
} from 'lucide-react-native';

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SPEECH_RATES = [0.8, 0.9, 1.0, 1.1, 1.2];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setLevel, saveUser } = useUserStore();
  const { settings, updateSetting, clearAllData, exportData } = useSettingsStore();

  const [backendUrl, setBackendUrl] = useState(settings.backend_url || 'http://localhost:8000');
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedJson, setExportedJson] = useState('');

  const handleTestConnection = async () => {
    setIsTestingApi(true);
    setConnectionStatus(null);
    try {
      updateSetting('backend_url', backendUrl.trim());
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
          <Text style={styles.subtitle}>Manage your learning preferences and local data</Text>
        </View>

        {/* User Card */}
        <View style={styles.card}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(user?.name || 'U').charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
              <Text style={styles.userGoal}>{user?.goal || 'General fluency'}</Text>
            </View>
            <Badge label={user?.level || 'B1'} variant="inverted" />
          </View>
        </View>

        {/* CEFR English Level Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TARGET ENGLISH LEVEL</Text>
          <View style={styles.levelGrid}>
            {CEFR_LEVELS.map((lvl) => {
              const isSelected = (user?.level || 'B1') === lvl;
              return (
                <TouchableOpacity
                  key={lvl}
                  activeOpacity={0.8}
                  onPress={() => setLevel(lvl)}
                  style={[styles.levelCard, isSelected && styles.levelCardActive]}
                >
                  <Text style={[styles.levelLabel, isSelected && styles.levelLabelActive]}>
                    {lvl}
                  </Text>
                  <Text style={[styles.levelSub, isSelected && styles.levelSubActive]}>
                    {lvl === 'A1' || lvl === 'A2'
                      ? 'Beginner'
                      : lvl === 'B1' || lvl === 'B2'
                      ? 'Intermediate'
                      : 'Advanced'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Voice & Speech Speed Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SPEECH & AUDIO</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingMeta}>
                <Volume2 size={18} color={Colors.primary} />
                <Text style={styles.settingTitle}>AI Speaking Speed</Text>
              </View>
              <Text style={styles.settingValue}>{settings.speech_rate}x</Text>
            </View>

            <View style={styles.speedRow}>
              {SPEECH_RATES.map((rate) => {
                const isSelected = settings.speech_rate === rate;
                return (
                  <TouchableOpacity
                    key={rate}
                    activeOpacity={0.8}
                    onPress={() => updateSetting('speech_rate', rate)}
                    style={[styles.speedChip, isSelected && styles.speedChipActive]}
                  >
                    <Text
                      style={[styles.speedChipText, isSelected && styles.speedChipTextActive]}
                    >
                      {rate}x
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Backend Endpoint Config */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FASTAPI BACKEND ENDPOINT</Text>
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <Server size={18} color={Colors.muted} />
              <TextInput
                style={styles.urlInput}
                value={backendUrl}
                onChangeText={setBackendUrl}
                placeholder="http://localhost:8000"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.testButton}
              onPress={handleTestConnection}
              disabled={isTestingApi}
            >
              <RefreshCw size={14} color={Colors.primary} />
              <Text style={styles.testButtonText}>
                {isTestingApi ? 'Testing...' : 'Test Connection'}
              </Text>
            </TouchableOpacity>

            {connectionStatus && (
              <Text style={styles.connectionStatusText}>{connectionStatus}</Text>
            )}
          </View>
        </View>

        {/* Local Storage & Export Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LOCAL-FIRST DATABASE</Text>
          <View style={styles.card}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionRow}
              onPress={handleExport}
            >
              <View style={styles.actionLeft}>
                <Download size={18} color={Colors.primary} />
                <Text style={styles.actionText}>Export Local Data (JSON)</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionRow}
              onPress={() => setShowClearModal(true)}
            >
              <View style={styles.actionLeft}>
                <Trash2 size={18} color={Colors.error} />
                <Text style={[styles.actionText, { color: Colors.error }]}>Clear All Local Data</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* About App */}
        <View style={styles.aboutCard}>
          <Info size={16} color={Colors.muted} />
          <Text style={styles.aboutText}>
            Echo AI Speaking Coach is 100% local-first. All your audio transcripts, mistake
            history, vocabulary, and scores are stored exclusively on your device in SQLite.
          </Text>
        </View>
      </ScrollView>

      {/* Confirmation Modal for Clearing Data */}
      <Modal visible={showClearModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Clear Local Database?</Text>
            <Text style={styles.modalDesc}>
              This will permanently delete all your conversation transcripts, mistake history,
              progress, and vocabulary stored on this device. This action cannot be undone.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowClearModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalDelete} onPress={handleClearData}>
                <Text style={styles.modalDeleteText}>Yes, Clear Everything</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Export JSON Modal */}
      <Modal visible={showExportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>Local Database Export</Text>
            <ScrollView style={styles.jsonPreview}>
              <Text style={styles.jsonText}>{exportedJson}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowExportModal(false)}
            >
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.margin,
    gap: Spacing.lg,
    paddingBottom: 40,
  },
  header: {
    paddingBottom: 4,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.headlineSm,
    color: Colors.primary,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  userGoal: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    ...Typography.labelLg,
    color: Colors.muted,
    textTransform: 'uppercase',
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelCard: {
    width: '31%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
    gap: 2,
  },
  levelCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  levelLabel: {
    ...Typography.labelLg,
    color: Colors.onSurface,
  },
  levelLabelActive: {
    color: Colors.onPrimary,
  },
  levelSub: {
    ...Typography.labelSm,
    fontSize: 9,
    color: Colors.muted,
  },
  levelSubActive: {
    color: Colors.outlineVariant,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingTitle: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  settingValue: {
    ...Typography.labelLg,
    color: Colors.primary,
  },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  speedChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surfaceSubtle,
  },
  speedChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  speedChipText: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  speedChipTextActive: {
    color: Colors.onPrimary,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    backgroundColor: Colors.surfaceSubtle,
  },
  urlInput: {
    flex: 1,
    height: 42,
    ...Typography.bodySm,
    color: Colors.onSurface,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
  },
  testButtonText: {
    ...Typography.labelMd,
    color: Colors.primary,
  },
  connectionStatusText: {
    ...Typography.bodySm,
    fontSize: 12,
    color: Colors.muted,
    textAlign: 'center',
  },
  actionRow: {
    paddingVertical: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outline,
  },
  aboutCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
    gap: 10,
    alignItems: 'flex-start',
  },
  aboutText: {
    ...Typography.bodySm,
    color: Colors.muted,
    flex: 1,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.margin,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: 14,
  },
  modalTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  modalDesc: {
    ...Typography.bodyMd,
    color: Colors.muted,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
  },
  modalCancelText: {
    ...Typography.labelLg,
    color: Colors.primary,
  },
  modalDelete: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.error,
    alignItems: 'center',
  },
  modalDeleteText: {
    ...Typography.labelLg,
    color: Colors.onPrimary,
  },
  jsonPreview: {
    maxHeight: 250,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: 10,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: Colors.onSurface,
  },
});
