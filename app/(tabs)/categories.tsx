import { useCategories } from "@/hooks/useCategories";
import { router } from "expo-router";
import { ChevronRight, FolderOpen, Plus } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CategoriesScreen() {
  const { categories } = useCategories();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
            <TouchableOpacity
              onPress={() => router.push(`/category/${category.id}`)}
              key={category.id}
              style={styles.categoryCard}
            >
              <View style={styles.categoryContent}>
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
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.createCategoryButton}>
          <Plus size={20} color="#2563EB" />
          <Text style={styles.createCategoryText}>Crear nueva categoria</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
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
    color: "#111827",
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  createCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    marginBottom: 20,
    gap: 8,
  },
  createCategoryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2563EB",
  },
});
