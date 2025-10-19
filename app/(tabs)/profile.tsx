
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';
import { useTabBarVisibility } from '@/contexts/TabBarVisibilityContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { setScrollY } = useTabBarVisibility();

  const handlePress = (action: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    switch (action) {
      case 'edit':
        Alert.alert('Edit Profile', 'Profile editing coming soon!');
        break;
      case 'settings':
        Alert.alert('Settings', 'Settings page coming soon!');
        break;
      case 'help':
        Alert.alert('Help & Support', 'Help center coming soon!');
        break;
      case 'logout':
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Sign Out',
              style: 'destructive',
              onPress: () => signOut(),
            },
          ]
        );
        break;
    }
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.fill" size={48} color="#ffffff" />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role}</Text>
          </View>
        </LinearGradient>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <IconSymbol name="number" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Staff ID</Text>
                <Text style={styles.infoValue}>{user?.staffId}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable
            style={styles.menuItem}
            onPress={() => handlePress('edit')}
          >
            <View style={styles.menuIconContainer}>
              <IconSymbol name="pencil" size={22} color={colors.primary} />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => handlePress('settings')}
          >
            <View style={styles.menuIconContainer}>
              <IconSymbol name="gearshape.fill" size={22} color={colors.primary} />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Pressable
            style={styles.menuItem}
            onPress={() => handlePress('help')}
          >
            <View style={styles.menuIconContainer}>
              <IconSymbol name="questionmark.circle.fill" size={22} color={colors.primary} />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <Pressable
            style={[styles.menuItem, styles.logoutItem]}
            onPress={() => handlePress('logout')}
          >
            <View style={[styles.menuIconContainer, styles.logoutIconContainer]}>
              <IconSymbol name="arrow.right.square.fill" size={22} color="#f44336" />
            </View>
            <Text style={[styles.menuText, styles.logoutText]}>Sign Out</Text>
            <IconSymbol name="chevron.right" size={20} color="#f44336" />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>BlakePrintz v1.0.0</Text>
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
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  logoutItem: {
    borderWidth: 1,
    borderColor: '#f4433620',
  },
  logoutIconContainer: {
    backgroundColor: '#f4433620',
  },
  logoutText: {
    color: '#f44336',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
