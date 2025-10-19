
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  staffId: string;
  role: string;
}

export default function UserAccountsScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      if (usersData) {
        const allUsers = JSON.parse(usersData);
        setUsers(allUsers);
      }
    } catch (error) {
      console.log('Error loading users:', error);
    } finally {
      setLoading(false);
    }
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Owner':
      case 'Admin':
        return 'crown.fill';
      case 'Supervisor':
        return 'star.fill';
      case 'Staff':
        return 'person.fill';
      default:
        return 'person.fill';
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.staffId.includes(searchQuery) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group users by role
  const groupedUsers = {
    Owner: filteredUsers.filter((u) => u.role === 'Owner'),
    Admin: filteredUsers.filter((u) => u.role === 'Admin'),
    Supervisor: filteredUsers.filter((u) => u.role === 'Supervisor'),
    Staff: filteredUsers.filter((u) => u.role === 'Staff'),
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen options={{ title: 'User Accounts' }} />
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
          title: 'User Accounts',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <View style={styles.content}>
        {/* Header Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="person.3.fill" size={32} color={colors.primary} />
            <Text style={styles.statValue}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="star.fill" size={32} color="#ff9800" />
            <Text style={styles.statValue}>{groupedUsers.Supervisor.length}</Text>
            <Text style={styles.statLabel}>Supervisors</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="person.fill" size={32} color="#4caf50" />
            <Text style={styles.statValue}>{groupedUsers.Staff.length}</Text>
            <Text style={styles.statLabel}>Staff</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
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
        >
          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="person.slash" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No users found</Text>
            </View>
          ) : (
            <>
              {/* Owners */}
              {groupedUsers.Owner.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Owners</Text>
                  {groupedUsers.Owner.map((user) => (
                    <View key={user.id} style={styles.userCard}>
                      <View style={styles.userInfo}>
                        <View
                          style={[
                            styles.avatarContainer,
                            { backgroundColor: getRoleColor(user.role) + '20' },
                          ]}
                        >
                          <IconSymbol
                            name={getRoleIcon(user.role)}
                            size={28}
                            color={getRoleColor(user.role)}
                          />
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
                    </View>
                  ))}
                </View>
              )}

              {/* Admins */}
              {groupedUsers.Admin.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Administrators</Text>
                  {groupedUsers.Admin.map((user) => (
                    <View key={user.id} style={styles.userCard}>
                      <View style={styles.userInfo}>
                        <View
                          style={[
                            styles.avatarContainer,
                            { backgroundColor: getRoleColor(user.role) + '20' },
                          ]}
                        >
                          <IconSymbol
                            name={getRoleIcon(user.role)}
                            size={28}
                            color={getRoleColor(user.role)}
                          />
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
                    </View>
                  ))}
                </View>
              )}

              {/* Supervisors */}
              {groupedUsers.Supervisor.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Supervisors</Text>
                  {groupedUsers.Supervisor.map((user) => (
                    <View key={user.id} style={styles.userCard}>
                      <View style={styles.userInfo}>
                        <View
                          style={[
                            styles.avatarContainer,
                            { backgroundColor: getRoleColor(user.role) + '20' },
                          ]}
                        >
                          <IconSymbol
                            name={getRoleIcon(user.role)}
                            size={28}
                            color={getRoleColor(user.role)}
                          />
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
                    </View>
                  ))}
                </View>
              )}

              {/* Staff */}
              {groupedUsers.Staff.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Staff Members</Text>
                  {groupedUsers.Staff.map((user) => (
                    <View key={user.id} style={styles.userCard}>
                      <View style={styles.userInfo}>
                        <View
                          style={[
                            styles.avatarContainer,
                            { backgroundColor: getRoleColor(user.role) + '20' },
                          ]}
                        >
                          <IconSymbol
                            name={getRoleIcon(user.role)}
                            size={28}
                            color={getRoleColor(user.role)}
                          />
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
                    </View>
                  ))}
                </View>
              )}
            </>
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
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
    gap: 12,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
});
