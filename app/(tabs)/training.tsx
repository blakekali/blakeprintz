
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
    title: '3D Printer Safety & Maintenance',
    description: 'Essential safety protocols and daily maintenance procedures',
    duration: '20 min',
    category: 'Safety',
    completed: false,
    progress: 0,
    content: {
      sections: [
        {
          title: 'Safety First',
          content: 'Working with 3D printers requires attention to safety. Always ensure proper ventilation, never touch the hot end during or immediately after printing, and wear safety glasses when removing support material. Keep the work area clean and organized.',
        },
        {
          title: 'Daily Maintenance',
          content: '1. Check bed leveling before each print\n2. Clean the build plate with isopropyl alcohol\n3. Inspect nozzle for clogs or debris\n4. Verify filament is properly loaded\n5. Check all belts for proper tension\n6. Lubricate linear rails weekly',
        },
        {
          title: 'Emergency Procedures',
          content: 'In case of fire, use the emergency stop button immediately and use a Class D fire extinguisher. Never use water on electrical fires. If the printer makes unusual noises or smells, stop the print immediately and notify your supervisor.',
        },
      ],
    },
  },
  {
    id: '2',
    title: 'Filament Types & Materials',
    description: 'Understanding different materials and their applications',
    duration: '25 min',
    category: 'Technical',
    completed: false,
    progress: 60,
    content: {
      sections: [
        {
          title: 'Common Materials',
          content: 'PLA (Polylactic Acid) is the most common material - easy to print, biodegradable, and great for prototypes. ABS offers higher strength and heat resistance. PETG combines the best of both with good strength and ease of printing. TPU is flexible for specialized applications.',
        },
        {
          title: 'Material Properties',
          content: 'PLA: Print temp 190-220°C, bed temp 50-60°C\nABS: Print temp 220-250°C, bed temp 80-110°C\nPETG: Print temp 220-250°C, bed temp 70-80°C\nTPU: Print temp 210-230°C, bed temp 30-60°C\n\nAlways check manufacturer specifications for exact temperatures.',
        },
        {
          title: 'Storage & Handling',
          content: 'Store filament in airtight containers with desiccant to prevent moisture absorption. Label all spools with material type and color. Rotate stock using FIFO method. Dry filament before use if it has been exposed to humidity.',
        },
      ],
    },
  },
  {
    id: '3',
    title: 'Slicing Software Basics',
    description: 'Master the slicer software for optimal print quality',
    duration: '30 min',
    category: 'Technical',
    completed: false,
    progress: 0,
    content: {
      sections: [
        {
          title: 'Introduction to Slicing',
          content: 'Slicing software converts 3D models into instructions (G-code) that the printer can understand. We use industry-standard slicing software that offers precise control over every aspect of the print.',
        },
        {
					 title: 'Software',
          content: 'The current software we Install on all computers is Crealitys Slicer which is used by all the printers we currently have.',
        },
        {
          title: 'Key Settings',
          content: 'Layer Height: 0.1-0.3mm (lower = better quality, longer print time)\nInfill: 10-20% for most parts, 50%+ for functional parts\nSupports: Enable for overhangs greater than 45°\nPrint Speed: 40-60mm/s for quality, up to 100mm/s for drafts\nWall Thickness: Minimum 2-3 perimeters',
        },
        {
          title: 'Quality Control',
          content: 'Always preview the sliced model before printing. Check for proper support placement, verify estimated print time and material usage, and ensure the model is properly oriented on the build plate for optimal strength and surface finish.',
        },
      ],
    },
  },
  {
    id: '4',
    title: 'Customer Service & Order Management',
    description: 'Best practices for handling customer orders and inquiries',
    duration: '18 min',
    category: 'Customer Service',
    completed: false,
    progress: 0,
    content: {
      sections: [
        {
          title: 'Taking Orders',
          content: 'When receiving a new order, verify all specifications: material type, color, quantity, and deadline. Discuss any design modifications needed for printability. Provide accurate time and cost estimates. Always confirm order details in writing.',
        },
        {
          title: 'Managing Expectations',
          content: '1. Be honest about turnaround times\n2. Explain material limitations clearly\n3. Show examples of similar work\n4. Discuss post-processing options\n5. Set realistic quality expectations\n6. Communicate any delays immediately',
        },
        {
          title: 'Quality Assurance',
          content: 'Inspect every print before delivery. Check for layer adhesion, dimensional accuracy, and surface finish. Remove all support material carefully. Clean parts with compressed air. Package items securely to prevent damage during transport.',
        },
      ],
    },
  },
  {
    id: '5',
    title: 'Troubleshooting Common Issues',
    description: 'Identify and resolve common 3D printing problems',
    duration: '35 min',
    category: 'Technical',
    completed: false,
    progress: 0,
    content: {
      sections: [
        {
          title: 'Print Adhesion Problems',
          content: 'If prints are not sticking to the bed: Re-level the bed, clean the build surface thoroughly, increase bed temperature by 5-10°C, use adhesion aids like glue stick or hairspray, or reduce first layer speed to 20mm/s.',
        },
        {
          title: 'Layer Issues',
          content: 'Stringing: Lower print temperature, increase retraction distance\nWarping: Increase bed temperature, use enclosure, add brim\nLayer shifting: Check belt tension, reduce print speed\nUnder-extrusion: Check for clogs, increase flow rate, verify filament diameter',
        },
        {
          title: 'When to Ask for Help',
          content: 'Contact your supervisor if: The printer makes grinding or clicking noises, you smell burning plastic or electronics, the hot end temperature fluctuates wildly, you encounter repeated print failures, or you are unsure about any procedure. Safety first!',
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
