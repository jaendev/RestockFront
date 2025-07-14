import { useCategories } from "@/hooks/useCategories";
import { useThemeColors } from "@/context/ThemeContext";
import { router } from "expo-router";
import { ChevronRight, FolderOpen, Plus, Edit } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CategoryForm } from "@/components/CategoryForm";
import { createCategory, updateCategory } from "@/services/categoryService";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryDto,
} from "@/types/category";

export default function CategoriesScreen() {
  const colors = useThemeColors();
  const { categories, refetch } = useCategories();

  // Form state management
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Handle create category
  const handleCreateCategory = async (categoryData: CreateCategoryRequest) => {
    try {
      await createCategory(categoryData);
      await refetch(); // Refresh categories list
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  // Handle update category
  const handleUpdateCategory = async (
    categoryId: number,
    categoryData: UpdateCategoryDto,
  ) => {
    try {
      await updateCategory(categoryId, categoryData);
      await refetch();
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingCategory(null);
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Category Form Modal */}
      <CategoryForm
        visible={showCreateForm || !!editingCategory}
        onClose={handleCloseForm}
        editCategory={editingCategory}
        onSubmit={handleCreateCategory}
        onUpdate={handleUpdateCategory}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{categories?.length}</Text>
            <Text style={styles.statsLabel}>Total Categorias</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>
              {categories?.reduce(
                (total, cat) => total + cat?.totalProducts,
                0,
              )}
            </Text>
            <Text style={styles.statsLabel}>Total Productos</Text>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          {categories?.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <TouchableOpacity
                onPress={() => router.push(`/category/${category.id}`)}
                style={styles.categoryContent}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: `${category.color}20` },
                  ]}
                >
                  <FolderOpen size={24} color={category.color} />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    {category.totalProducts} items
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.categoryActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditCategory(category)}
                >
                  <Edit size={16} color={colors.icon} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => router.push(`/category/${category.id}`)}
                >
                  <ChevronRight size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.createCategoryButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Plus size={20} color="#2563EB" />
          <Text style={styles.createCategoryText}>Crear nueva categoria</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Dynamic styles based on theme colors
const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 60,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    statsContainer: {
      flexDirection: "row",
      marginTop: 20,
      marginBottom: 24,
      gap: 12,
    },
    statsCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 2,
    },
    statsNumber: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    statsLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
    },
    categoriesContainer: {
      marginBottom: 24,
    },
    categoryCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: colors.shadow,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 2,
    },
    categoryContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    categoryIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    categoryCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    categoryActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    editButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.borderLight,
    },
    navButton: {
      padding: 4,
    },
    createCategoryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: "dashed",
      marginBottom: 20,
      gap: 8,
    },
    createCategoryText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.primary,
    },
  });
