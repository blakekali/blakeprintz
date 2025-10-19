
import React from "react";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/commonStyles";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "3D Print Dashboard",
          }}
        />
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome Back!</Text>
          <Text style={styles.headerSubtitle}>3D Printing Business Dashboard</Text>
        </View>

        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="cube.fill" size={28} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Active Prints</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.secondary + '20' }]}>
              <IconSymbol name="book.fill" size={28} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Training Modules</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionCard}>
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="cube.fill" size={24} color={colors.primary} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Manage Print Orders</Text>
                <Text style={styles.actionDescription}>
                  View and update print job status, track materials and time
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionCard}>
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary + '20' }]}>
                <IconSymbol name="book.fill" size={24} color={colors.secondary} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Complete Training</Text>
                <Text style={styles.actionDescription}>
                  Learn about 3D printing techniques, safety, and best practices
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Order #3DP-003 completed</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Safety training module completed</Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New order #3DP-004 started printing</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>

        <View style={styles.printerStatus}>
          <Text style={styles.sectionTitle}>Printer Status</Text>
          
          <View style={styles.printerCard}>
            <View style={styles.printerHeader}>
              <View style={styles.printerInfo}>
                <IconSymbol name="printer.fill" size={20} color={colors.primary} />
                <Text style={styles.printerName}>Printer 1 - Prusa i3 MK3S+</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: '#4caf50' }]} />
            </View>
            <Text style={styles.printerStatus}>Printing: Robot Arm Components</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '65%' }]} />
            </View>
            <Text style={styles.printerTime}>2h 15m remaining</Text>
          </View>

          <View style={styles.printerCard}>
            <View style={styles.printerHeader}>
              <View style={styles.printerInfo}>
                <IconSymbol name="printer.fill" size={20} color={colors.primary} />
                <Text style={styles.printerName}>Printer 2 - Ender 3 V2</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: '#ff9800' }]} />
            </View>
            <Text style={styles.printerStatus}>Idle - Ready for next job</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            This app is designed for Raspberry Pi OS and helps staff manage 3D print orders, track printer status, and complete training modules efficiently.
          </Text>
        </View>
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
    paddingTop: 20,
    paddingBottom: 24,
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
  quickStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  printerStatus: {
    marginBottom: 24,
  },
  printerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  printerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  printerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  printerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  printerStatus: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.highlight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  printerTime: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
