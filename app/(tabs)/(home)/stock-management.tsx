
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
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

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  lastUpdated: string;
}

const INITIAL_STOCK: StockItem[] = [
  {
    id: '1',
    name: 'PLA Filament - Black',
    category: 'Filament',
    quantity: 15,
    unit: 'kg',
    minQuantity: 5,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'PLA Filament - White',
    category: 'Filament',
    quantity: 12,
    unit: 'kg',
    minQuantity: 5,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'PETG Filament - Clear',
    category: 'Filament',
    quantity: 8,
    unit: 'kg',
    minQuantity: 3,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Nozzles 0.4mm',
    category: 'Parts',
    quantity: 25,
    unit: 'pcs',
    minQuantity: 10,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Build Plates',
    category: 'Parts',
    quantity: 6,
    unit: 'pcs',
    minQuantity: 2,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Isopropyl Alcohol',
    category: 'Supplies',
    quantity: 3,
    unit: 'L',
    minQuantity: 2,
    lastUpdated: new Date().toISOString(),
  },
];

export default function StockManagementScreen() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Filament');
  const [formQuantity, setFormQuantity] = useState('');
  const [formUnit, setFormUnit] = useState('kg');
  const [formMinQuantity, setFormMinQuantity] = useState('');

  const categories = ['Filament', 'Parts', 'Supplies', 'Tools'];
  const units = ['kg', 'g', 'L', 'mL', 'pcs'];

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const stockData = await AsyncStorage.getItem('stock');
      if (stockData) {
        setStock(JSON.parse(stockData));
      } else {
        // Initialize with default stock
        await AsyncStorage.setItem('stock', JSON.stringify(INITIAL_STOCK));
        setStock(INITIAL_STOCK);
      }
    } catch (error) {
      console.log('Error loading stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveStock = async (newStock: StockItem[]) => {
    try {
      await AsyncStorage.setItem('stock', JSON.stringify(newStock));
      setStock(newStock);
    } catch (error) {
      console.log('Error saving stock:', error);
      Alert.alert('Error', 'Failed to save stock data');
    }
  };

  const openAddModal = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setEditingItem(null);
    setFormName('');
    setFormCategory('Filament');
    setFormQuantity('');
    setFormUnit('kg');
    setFormMinQuantity('');
    setModalVisible(true);
  };

  const openEditModal = (item: StockItem) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(item.quantity.toString());
    setFormUnit(item.unit);
    setFormMinQuantity(item.minQuantity.toString());
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formName || !formQuantity || !formMinQuantity) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const quantity = parseFloat(formQuantity);
    const minQuantity = parseFloat(formMinQuantity);

    if (isNaN(quantity) || isNaN(minQuantity) || quantity < 0 || minQuantity < 0) {
      Alert.alert('Error', 'Please enter valid numbers for quantities');
      return;
    }

    if (editingItem) {
      // Update existing item
      const updatedStock = stock.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formName,
              category: formCategory,
              quantity,
              unit: formUnit,
              minQuantity,
              lastUpdated: new Date().toISOString(),
            }
          : item
      );
      await saveStock(updatedStock);
    } else {
      // Add new item
      const newItem: StockItem = {
        id: Date.now().toString(),
        name: formName,
        category: formCategory,
        quantity,
        unit: formUnit,
        minQuantity,
        lastUpdated: new Date().toISOString(),
      };
      await saveStock([...stock, newItem]);
    }

    setModalVisible(false);
  };

  const handleDelete = (item: StockItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedStock = stock.filter((i) => i.id !== item.id);
            await saveStock(updatedStock);
          },
        },
      ]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Filament':
        return '#2196f3';
      case 'Parts':
        return '#ff9800';
      case 'Supplies':
        return '#4caf50';
      case 'Tools':
        return '#9c27b0';
      default:
        return colors.primary;
    }
  };

  const isLowStock = (item: StockItem) => item.quantity <= item.minQuantity;

  const filteredStock = stock.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = stock.filter(isLowStock);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen options={{ title: 'Stock Management' }} />
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
          title: 'Stock Management',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search supplies..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <View style={styles.alertCard}>
            <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#ff9800" />
            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>Low Stock Alert</Text>
              <Text style={styles.alertDescription}>
                {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low
              </Text>
            </View>
          </View>
        )}

        {/* Stock List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredStock.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.stockCard,
                isLowStock(item) && styles.stockCardLowStock,
              ]}
              onPress={() => openEditModal(item)}
            >
              <View style={styles.stockHeader}>
                <View style={styles.stockInfo}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(item.category) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: getCategoryColor(item.category) },
                      ]}
                    >
                      {item.category}
                    </Text>
                  </View>
                  <Text style={styles.stockName}>{item.name}</Text>
                </View>
                <Pressable
                  onPress={() => handleDelete(item)}
                  style={styles.deleteButton}
                >
                  <IconSymbol name="trash.fill" size={20} color="#f44336" />
                </Pressable>
              </View>
              <View style={styles.stockDetails}>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Current Stock</Text>
                  <Text
                    style={[
                      styles.quantityValue,
                      isLowStock(item) && styles.quantityValueLow,
                    ]}
                  >
                    {item.quantity} {item.unit}
                  </Text>
                </View>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Min Required</Text>
                  <Text style={styles.minQuantity}>
                    {item.minQuantity} {item.unit}
                  </Text>
                </View>
              </View>
              {isLowStock(item) && (
                <View style={styles.lowStockBadge}>
                  <IconSymbol name="exclamationmark.circle.fill" size={16} color="#ff9800" />
                  <Text style={styles.lowStockText}>Low Stock</Text>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>

        {/* Add Button */}
        <Pressable style={styles.addButton} onPress={openAddModal}>
          <IconSymbol name="plus.circle.fill" size={28} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Supply</Text>
        </Pressable>
      </View>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Supply' : 'Add New Supply'}
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Supply name"
                    placeholderTextColor={colors.textSecondary}
                    value={formName}
                    onChangeText={setFormName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Category</Text>
                  <View style={styles.categoryButtons}>
                    {categories.map((cat) => (
                      <Pressable
                        key={cat}
                        style={[
                          styles.categoryButton,
                          formCategory === cat && styles.categoryButtonActive,
                        ]}
                        onPress={() => setFormCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            formCategory === cat && styles.categoryButtonTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 2 }]}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      value={formQuantity}
                      onChangeText={setFormQuantity}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Unit</Text>
                    <View style={styles.unitButtons}>
                      {units.map((u) => (
                        <Pressable
                          key={u}
                          style={[
                            styles.unitButton,
                            formUnit === u && styles.unitButtonActive,
                          ]}
                          onPress={() => setFormUnit(u)}
                        >
                          <Text
                            style={[
                              styles.unitButtonText,
                              formUnit === u && styles.unitButtonTextActive,
                            ]}
                          >
                            {u}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Minimum Quantity</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    value={formMinQuantity}
                    onChangeText={setFormMinQuantity}
                    keyboardType="decimal-pad"
                  />
                </View>

                <Pressable style={styles.saveButton} onPress={handleSave}>
                  <IconSymbol name="checkmark.circle.fill" size={24} color="#ffffff" />
                  <Text style={styles.saveButtonText}>
                    {editingItem ? 'Update' : 'Add'} Supply
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
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
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 12,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e65100',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 14,
    color: '#ef6c00',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  stockCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  stockCardLowStock: {
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stockInfo: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stockName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  deleteButton: {
    padding: 8,
  },
  stockDetails: {
    flexDirection: 'row',
    gap: 24,
  },
  quantityContainer: {
    flex: 1,
  },
  quantityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  quantityValueLow: {
    color: '#ff9800',
  },
  minQuantity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  lowStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.highlight,
  },
  lowStockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff9800',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 6,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  modalForm: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    color: colors.text,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: colors.primary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  unitButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  unitButtonActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  unitButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  unitButtonTextActive: {
    color: colors.primary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 12,
    marginTop: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
});
