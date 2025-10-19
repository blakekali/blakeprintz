
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';
import { useTabBarVisibility } from '@/contexts/TabBarVisibilityContext';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  completed: boolean;
  progress: number;
  content: {
    sections: {
      title: string;
      content: string;
    }[];
  };
}

const INITIAL_MODULES: TrainingModule[] = [
  {
    id: '1',
    title: '3D Printing Basics',
    description: 'Learn the fundamentals of 3D printing technology and processes',
    duration: '45 min',
    category: 'Beginner',
    completed: true,
    progress: 100,
    content: {
      sections: [
        {
          title: 'Introduction',
          content: 'Welcome to 3D printing! This module covers the basic concepts...',
        },
        {
          title: 'Materials',
          content: 'Understanding different filament types and their properties...',
        },
      ],
    },
  },
  {
    id: '2',
    title: 'Safety Procedures',
    description: 'Essential safety guidelines for operating 3D printers',
    duration: '30 min',
    category: 'Required',
    completed: false,
    progress: 60,
    content: {
      sections: [
        {
          title: 'General Safety',
          content: 'Always follow these safety guidelines when working with 3D printers...',
        },
        {
          title: 'Emergency Procedures',
          content: 'In case of emergency, follow these steps...',
        },
      ],
    },
  },
  {
    id: '3',
    title: 'Advanced Techniques',
    description: 'Master advanced printing techniques and troubleshooting',
    duration: '90 min',
    category: 'Advanced',
    completed: false,
    progress: 0,
    content: {
      sections: [
        {
          title: 'Layer Optimization',
          content: 'Learn how to optimize layer height and print quality...',
        },
        {
          title: 'Support Structures',
          content: 'Understanding when and how to use support structures...',
        },
      ],
    },
  },
];

export default function TrainingScreen() {
  const { setScrollY } = useTabBarVisibility();
  const [modules, setModules] = useState<TrainingModule[]>(INITIAL_MODULES);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Beginner':
        return '#4caf50';
      case 'Required':
        return '#f44336';
      case 'Advanced':
        return '#2196f3';
      default:
        return colors.primary;
    }
  };

  const openModule = (module: TrainingModule) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedModule(module);
    setCurrentSection(0);
    setModalVisible(true);
  };

  const completeModule = () => {
    if (selectedModule) {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setModules(modules.map(m =>
        m.id === selectedModule.id ? { ...m, completed: true, progress: 100 } : m
      ));
      setModalVisible(false);
    }
  };

  const nextSection = () => {
    if (selectedModule && currentSection < selectedModule.content.sections.length - 1) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setCurrentSection(currentSection + 1);
    }
  };

  const previousSection = () => {
    if (currentSection > 0) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setCurrentSection(currentSection - 1);
    }
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {modules.filter(m => m.completed).length}/{modules.length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {modules.map((module) => (
          <Pressable
            key={module.id}
            style={styles.moduleCard}
            onPress={() => openModule(module)}
          >
            <View style={styles.moduleHeader}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor(module.category) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: getCategoryColor(module.category) },
                  ]}
                >
                  {module.category}
                </Text>
              </View>
              {module.completed && (
                <View style={styles.completedBadge}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="#4caf50" />
                </View>
              )}
            </View>

            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleDescription}>{module.description}</Text>

            <View style={styles.moduleFooter}>
              <View style={styles.durationContainer}>
                <IconSymbol name="clock.fill" size={16} color={colors.textSecondary} />
                <Text style={styles.durationText}>{module.duration}</Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${module.progress}%`,
                        backgroundColor: getCategoryColor(module.category),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{module.progress}%</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedModule && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedModule.title}</Text>
                  <Pressable onPress={() => setModalVisible(false)}>
                    <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
                  </Pressable>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.sectionIndicator}>
                    <Text style={styles.sectionNumber}>
                      Section {currentSection + 1} of {selectedModule.content.sections.length}
                    </Text>
                  </View>

                  <Text style={styles.sectionTitle}>
                    {selectedModule.content.sections[currentSection].title}
                  </Text>
                  <Text style={styles.sectionContent}>
                    {selectedModule.content.sections[currentSection].content}
                  </Text>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <Pressable
                    style={[
                      styles.navButton,
                      currentSection === 0 && styles.navButtonDisabled,
                    ]}
                    onPress={previousSection}
                    disabled={currentSection === 0}
                  >
                    <IconSymbol
                      name="chevron.left"
                      size={20}
                      color={currentSection === 0 ? colors.textSecondary : colors.primary}
                    />
                    <Text
                      style={[
                        styles.navButtonText,
                        currentSection === 0 && styles.navButtonTextDisabled,
                      ]}
                    >
                      Previous
                    </Text>
                  </Pressable>

                  {currentSection === selectedModule.content.sections.length - 1 ? (
                    <Pressable style={styles.completeButton} onPress={completeModule}>
                      <Text style={styles.completeButtonText}>Complete Module</Text>
                      <IconSymbol name="checkmark.circle.fill" size={20} color="#ffffff" />
                    </Pressable>
                  ) : (
                    <Pressable style={styles.navButton} onPress={nextSection}>
                      <Text style={styles.navButtonText}>Next</Text>
                      <IconSymbol name="chevron.right" size={20} color={colors.primary} />
                    </Pressable>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  moduleCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4caf50' + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  moduleFooter: {
    gap: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    minWidth: 40,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionIndicator: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  sectionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  sectionContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  navButtonTextDisabled: {
    color: colors.textSecondary,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#4caf50',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
