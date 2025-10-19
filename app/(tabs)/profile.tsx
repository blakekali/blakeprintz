
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { colors } from "@/styles/commonStyles";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const handlePress = (action: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log(`${action} pressed`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={48} color={colors.card} />
            </View>
          </View>
          <Text style={styles.name}>3D Print Operator</Text>
          <Text style={styles.role}>Production Team Member</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable
            style={styles.menuItem}
            onPress={() => handlePress('Edit Profile')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="person.circle.fill" size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => handlePress('Change Password')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.secondary + '20' }]}>
                <IconSymbol name="lock.fill" size={24} color={colors.secondary} />
              </View>
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => handlePress('Notifications')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.accent + '20' }]}>
                <IconSymbol name="bell.fill" size={24} color={colors.accent} />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Prints Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1/5</Text>
              <Text style={styles.statLabel}>Training Complete</Text>
            </View>
          </View>

          <View style={styles.certificationsCard}>
            <Text style={styles.certificationsTitle}>Certifications</Text>
            <View style={styles.certificationItem}>
              <IconSymbol name="checkmark.seal.fill" size={20} color="#4caf50" />
              <Text style={styles.certificationText}>3D Printer Safety Certified</Text>
            </View>
            <View style={styles.certificationItem}>
              <IconSymbol name="clock.fill" size={20} color={colors.textSecondary} />
              <Text style={[styles.certificationText, { color: colors.textSecondary }]}>
                Advanced Materials - In Progress
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Pressable
            style={styles.menuItem}
            onPress={() => handlePress('Help Center')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="questionmark.circle.fill" size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => handlePress('Contact Support')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.secondary + '20' }]}>
                <IconSymbol name="envelope.fill" size={24} color={colors.secondary} />
              </View>
              <Text style={styles.menuItemText}>Contact Support</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => handlePress('Safety Guidelines')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.accent + '20' }]}>
                <IconSymbol name="exclamationmark.shield.fill" size={24} color={colors.accent} />
              </View>
              <Text style={styles.menuItemText}>Safety Guidelines</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => handlePress('About')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.textSecondary + '20' }]}>
                <IconSymbol name="info.circle.fill" size={24} color={colors.textSecondary} />
              </View>
              <Text style={styles.menuItemText}>About</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={() => handlePress('Logout')}
        >
          <IconSymbol name="arrow.right.square.fill" size={24} color="#ffffff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>Version 1.0.0 - 3D Print Manager</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.highlight,
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  certificationsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  certificationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  certificationText: {
    fontSize: 14,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  version: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
});
