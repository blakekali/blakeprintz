
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { useTabBarVisibility } from '@/contexts/TabBarVisibilityContext';

interface User {
  id: string;
  email: string;
  name: string;
  staffId: string;
  role: string;
}

export default function TerminateAccountScreen() {
  const { user: currentUser } = useAuth();
  const { setScrollY } = useTabBarVisibility();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      if (usersData) {
        const allUsers = JSON.parse(usersData);
        // Filter out the current user (can't terminate yourself)
        const otherUsers = allUsers.filter((u: User) => u.id !== currentUser?.id);
        setUsers(otherUsers);
      }
    } catch (error) {
      console.log('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleTerminate = async (user: User) => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    Alert.alert(
      'Terminate Account',
      `Are you sure you want to terminate ${user.name}'s account? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            console.log('Termination cancelled');
          },
        },
        {
          text: 'Terminate',
          style: 'destructive',
          onPress: async () => {
            console.log('Starting termination process for user:', user.id);
            try {
              const usersData = await AsyncStorage.getItem('users');
              console.log('Current users data:', usersData);
              
              if (usersData) {
                const allUsers = JSON.parse(usersData);
                console.log('All users before deletion:', allUsers.length);
                
                const updatedUsers = allUsers.filter((u: User) => u.id !== user.id);
                console.log('All users after deletion:', updatedUsers.length);
                
                await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
                console.log('Users saved to AsyncStorage');
                
                // Update local state
                const otherUsers = updatedUsers.filter((u: User) => u.id !== currentUser?.id);
                setUsers(otherUsers);
                
                if (Platform.OS === 'ios') {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
                
                Alert.alert('Success', `${user.name}'s account has been terminated`);
              } else {
                console.log('No users data found in AsyncStorage');
                Alert.alert('Error', 'No users data found');
              }
            } catch (error) {
              console.log('Error terminating account:', error);
              Alert.alert('Error', 'Failed to terminate account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Owner':
      case 'Admin':
        return '#f44336';
      case 'Supervisor':
        return '#ff9800';
      case 'Staff':
        return '#4caf50';
      default:
        return colors.primary;
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.staffId.includes(searchQuery)
  );

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen options={{ title: 'Terminate Account' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Terminate Account',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <View style={styles.content}>
        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <IconSymbol name="exclamationmark.triangle.fill" size={28} color="#f44336" />
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>Caution</Text>
            <Text style={styles.warningDescription}>
              Terminating an account will permanently remove the user from the system
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, or staff ID..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* User List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="person.slash" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No users found</Text>
            </View>
          ) : (
            filteredUsers.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <View style={styles.avatarContainer}>
                    <IconSymbol name="person.fill" size={28} color={colors.primary} />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={styles.userMeta}>
                      <View
                        style={[
                          styles.roleBadge,
                          { backgroundColor: getRoleColor(user.role) + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleText,
                            { color: getRoleColor(user.role) },
                          ]}
                        >
                          {user.role}
                        </Text>
                      </View>
                      <Text style={styles.staffId}>ID: {user.staffId}</Text>
                    </View>
                  </View>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.terminateButton,
                    pressed && styles.terminateButtonPressed,
                  ]}
                  onPress={() => handleTerminate(user)}
                >
                  <IconSymbol name="trash.fill" size={20} color="#ffffff" />
                  <Text style={styles.terminateButtonText}>Terminate</Text>
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#c62828',
    marginBottom: 4,
  },
  warningDescription: {
    fontSize: 14,
    color: '#d32f2f',
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  userCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  staffId: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  terminateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  terminateButtonPressed: {
    backgroundColor: '#d32f2f',
    opacity: 0.8,
  },
  terminateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
