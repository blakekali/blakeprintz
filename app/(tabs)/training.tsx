
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
    title: 'Customer Service Basics',
    description: 'Learn the fundamentals of excellent customer service',
    duration: '15 min',
    category: 'Customer Service',
    completed: true,
    progress: 100,
    content: {
      sections: [
        {
          title: 'Introduction',
          content: 'Customer service is the backbone of any successful business. In this module, you will learn the essential skills needed to provide exceptional service to every customer.',
        },
        {
          title: 'Key Principles',
          content: '1. Always greet customers with a smile\n2. Listen actively to their needs\n3. Be patient and understanding\n4. Offer solutions, not excuses\n5. Follow up to ensure satisfaction',
        },
        {
          title: 'Best Practices',
          content: 'Always maintain a positive attitude, even in challenging situations. Remember that every customer interaction is an opportunity to build loyalty and trust.',
        },
      ],
    },
  },
  {
    id: '2',
    title: 'Point of Sale System',
    description: 'Master the POS system for efficient order processing',
    duration: '20 min',
    category: 'Technical',
    completed: false,
    progress: 60,
    content: {
      sections: [
        {
          title: 'Getting Started',
          content: 'The Point of Sale (POS) system is your primary tool for processing orders. This training will cover all essential functions.',
        },
        {
          title: 'Processing Orders',
          content: '1. Select items from the menu\n2. Apply any discounts or promotions\n3. Choose payment method\n4. Print receipt\n5. Complete the transaction',
        },
        {
          title: 'Troubleshooting',
          content: 'If you encounter any issues with the POS system, first try restarting the application. If problems persist, contact your supervisor immediately.',
        },
      ],
    },
  },
  {
    id: '3',
    title: 'Food Safety & Hygiene',
    description: 'Essential food safety practices and hygiene standards',
    duration: '25 min',
    category: 'Safety',
    completed: false,
    progress: 0,
    content: {
      sections: [
        {
          title: 'Food Safety Basics',
          content: 'Food safety is critical to protecting our customers and maintaining our reputation. This module covers essential safety practices.',
        },
        {
          title: 'Personal Hygiene',
          content: '1. Wash hands frequently and thoroughly\n2. Wear clean uniforms\n3. Keep hair tied back\n4. No jewelry except plain wedding bands\n5. Cover any cuts or wounds',
        },
        {
          title: 'Food Handling',
          content: 'Always check expiration dates, store food at proper temperatures, avoid cross-contamination, and follow FIFO (First In, First Out) principles.',
        },
      ],
    },
  },
  {
    id: '4',
    title: 'Conflict Resolution',
    description: 'Handle difficult situations with confidence',
    duration: '18 min',
    category: 'Customer Service',
    completed: false,
    progress: 0,
    content: {
      sections: [
        {
          title: 'Understanding Conflict',
          content: 'Conflicts are a natural part of customer service. The key is to handle them professionally and turn negative situations into positive outcomes.',
        },
        {
          title: 'De-escalation Techniques',
          content: '1. Stay calm and composed\n2. Listen without interrupting\n3. Acknowledge their concerns\n4. Apologize sincerely\n5. Offer solutions\n6. Know when to involve management',
        },
        {
          title: 'Follow-up',
          content: 'After resolving a conflict, document the incident and follow up with the customer to ensure their satisfaction.',
        },
      ],
    },
  },
];

export default function TrainingScreen() {
  const [modules, setModules] = useState<TrainingModule[]>(INITIAL_MODULES);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Customer Service':
        return colors.primary;
      case 'Technical':
        return colors.secondary;
      case 'Safety':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };

  const openModule = (module: TrainingModule) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedModule(module);
    setCurrentSection(0);
    setModalVisible(true);
  };

  const completeModule = () => {
    if (selectedModule) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === selectedModule.id
            ? { ...module, completed: true, progress: 100 }
            : module
        )
      );
      setModalVisible(false);
      setSelectedModule(null);
    }
  };

  const nextSection = () => {
    if (selectedModule && currentSection < selectedModule.content.sections.length - 1) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setCurrentSection(currentSection + 1);
    }
  };

  const previousSection = () => {
    if (currentSection > 0) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setCurrentSection(currentSection - 1);
    }
  };

  const completedCount = modules.filter(m => m.completed).length;
  const totalCount = modules.length;
  const overallProgress = (completedCount / totalCount) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training Center</Text>
        <Text style={styles.headerSubtitle}>
          {completedCount} of {totalCount} modules completed
        </Text>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <Text style={styles.progressPercentage}>{Math.round(overallProgress)}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${overallProgress}%` }]} />
        </View>
      </View>

      <ScrollView
        style={styles.modulesList}
        contentContainerStyle={styles.modulesListContent}
        showsVerticalScrollIndicator={false}
      >
        {modules.map(module => (
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

              {!module.completed && module.progress > 0 && (
                <View style={styles.moduleProgressContainer}>
                  <View style={styles.moduleProgressBar}>
                    <View
                      style={[
                        styles.moduleProgressFill,
                        { width: `${module.progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.moduleProgressText}>{module.progress}%</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          {selectedModule && (
            <>
              <View style={styles.modalHeader}>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <IconSymbol name="xmark" size={24} color={colors.text} />
                </Pressable>
                <Text style={styles.modalTitle}>{selectedModule.title}</Text>
                <View style={{ width: 24 }} />
              </View>

              <View style={styles.sectionIndicator}>
                <Text style={styles.sectionIndicatorText}>
                  Section {currentSection + 1} of {selectedModule.content.sections.length}
                </Text>
              </View>

              <ScrollView
                style={styles.contentContainer}
                contentContainerStyle={styles.contentContainerInner}
              >
                <Text style={styles.sectionTitle}>
                  {selectedModule.content.sections[currentSection].title}
                </Text>
                <Text style={styles.sectionContent}>
                  {selectedModule.content.sections[currentSection].content}
                </Text>
              </ScrollView>

              <View style={styles.navigationButtons}>
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
                  <Pressable
                    style={[styles.navButton, styles.completeButton]}
                    onPress={completeModule}
                  >
                    <Text style={styles.completeButtonText}>Complete Module</Text>
                    <IconSymbol name="checkmark" size={20} color="#ffffff" />
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
        </SafeAreaView>
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
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  progressCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.highlight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  modulesList: {
    flex: 1,
  },
  modulesListContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 100,
  },
  moduleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
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
    marginBottom: 12,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  moduleProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moduleProgressBar: {
    width: 60,
    height: 6,
    backgroundColor: colors.highlight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  moduleProgressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 3,
  },
  moduleProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  sectionIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.highlight,
  },
  sectionIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  contentContainerInner: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  sectionContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.highlight,
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
    flex: 1,
  },
  navButtonDisabled: {
    borderColor: colors.textSecondary,
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
