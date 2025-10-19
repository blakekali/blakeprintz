
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from "react-native";
import { colors } from "@/styles/commonStyles";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  userStaffId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  certificationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  signOutButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handlePress = (action: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log(`Action pressed: ${action}`);
    
    if (action === 'signout') {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
              } catch (error) {
                console.log('Sign out error:', error);
                Alert.alert('Error', 'Failed to sign out');
              }
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['#1a237e', '#0d47a1', '#01579b']}
            style={styles.headerGradient}
          >
            <View style={styles.avatarContainer}>
              <IconSymbol name="person.fill" size={50} color="#ffffff" />
            </View>
            <Text style={styles.userName}>{user?.name || 'Staff Member'}</Text>
            <Text style={styles.userRole}>{user?.role || 'Staff'}</Text>
            <Text style={styles.userStaffId}>ID: {user?.staffId || 'N/A'}</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <IconSymbol name="checkmark.circle.fill" size={32} color={colors.primary} />
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Orders Completed</Text>
            </View>
            <View style={styles.statCard}>
              <IconSymbol name="clock.fill" size={32} color={colors.secondary} />
              <Text style={styles.statValue}>156h</Text>
              <Text style={styles.statLabel}>Print Time</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol name="rosette" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Completed Training</Text>
            </View>
            <View style={styles.certificationItem}>
              <IconSymbol name="checkmark.seal.fill" size={20} color="#4caf50" />
              <Text style={styles.certificationText}>3D Printer Safety</Text>
            </View>
            <View style={styles.certificationItem}>
              <IconSymbol name="checkmark.seal.fill" size={20} color="#4caf50" />
              <Text style={styles.certificationText}>Material Handling</Text>
            </View>
            <View style={styles.certificationItem}>
              <IconSymbol name="checkmark.seal.fill" size={20} color="#4caf50" />
              <Text style={styles.certificationText}>Slicing Software Basics</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <Pressable 
            style={styles.menuItem}
            onPress={() => handlePress('notifications')}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="bell.fill" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable 
            style={styles.menuItem}
            onPress={() => handlePress('preferences')}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="gearshape.fill" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Preferences</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable 
            style={styles.menuItem}
            onPress={() => handlePress('help')}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="questionmark.circle.fill" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable 
            style={styles.signOutButton}
            onPress={() => handlePress('signout')}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#ffffff" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
