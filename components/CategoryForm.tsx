import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  X,
  FolderOpen,
  Palette,
} from "lucide-react-native";
import { Category, CreateCategoryRequest, UpdateCategoryDto } from "@/types/category";

interface CategoryFormProps {
  visible: boolean;
  onClose: () => void;
  editCategory?: Category | null;
  onSubmit: (category: CreateCategoryRequest) => Promise<void>;
  onUpdate?: (categoryId: number, category: UpdateCategoryDto) => Promise<void>;
}

// Predefined color palette for categories
const COLOR_PALETTE = [
  "#2563EB", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#EC4899", // Pink
  "#84CC16", // Lime
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F43F5E", // Rose
];

export function CategoryForm({
  visible,
  onClose,
  editCategory,
  onSubmit,
  onUpdate,
}: CategoryFormProps) {
  const isEditMode = !!editCategory;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<CreateCategoryRequest & { description?: string }>({
    name: "",
    description: "",
    color: COLOR_PALETTE[0],
  });

  useEffect(() => {
    if (visible) {
      if (isEditMode && editCategory) {
        // Edit mode: populate with existing data
        setFormData({
          name: editCategory.name,
          description: editCategory.description || "",
          color: editCategory.color,
        });

        console.log("📝 Edit mode: data loaded", editCategory);
      } else {
        // Create mode: default values
        setFormData({
          name: "",
          description: "",
          color: COLOR_PALETTE[0],
        });

        console.log("✨ Create mode: default values");
      }

      setErrors({});
    }
  }, [visible, editCategory, isEditMode]);

  const updateField = (
    field: keyof (CreateCategoryRequest & { description?: string }),
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.color) {
      newErrors.color = "Debe seleccionar un color";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Por favor corrige los errores en el formulario");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && onUpdate && editCategory) {
        // Edit mode - backend expects all required fields
        const updateData: UpdateCategoryDto = {
          name: formData.name,
          description: formData.description || undefined,
          color: formData.color,
          isActive: editCategory.isActive, // Keep current active state
        };
        await onUpdate(editCategory.id, updateData);
        Alert.alert("Éxito", "Categoría actualizada correctamente");
      } else {
        // Create mode
        const createData: CreateCategoryRequest = {
          name: formData.name,
          color: formData.color,
        };
        await onSubmit(createData);
        Alert.alert("Éxito", "Categoría creada correctamente");
      }

      onClose();
    } catch (error) {
      const errorMessage = isEditMode
        ? "No se pudo actualizar la categoría"
        : "No se pudo crear la categoría";
      Alert.alert("Error", errorMessage);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category Icon */}
          <View style={styles.iconContainer}>
            <View style={[styles.categoryIcon, { backgroundColor: formData.color + "20" }]}>
              <FolderOpen size={40} color={formData.color} />
            </View>
            <Text style={styles.iconText}>
              {isEditMode
                ? "Editar categoría existente"
                : "Crear nueva categoría"}
            </Text>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Básica</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Nombre de la categoría <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Ej: Alimentos, Limpieza, Bebidas"
                value={formData.name}
                onChangeText={(text) => updateField("name", text)}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción de la categoría..."
                value={formData.description}
                onChangeText={(text) => updateField("description", text)}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="sentences"
              />
            </View>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color de Identificación</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Selecciona un color <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.colorPaletteContainer}>
                <TouchableOpacity style={styles.selectedColorDisplay}>
                  <Palette
                    size={18}
                    color="#6B7280"
                    style={styles.paletteIcon}
                  />
                  <View style={[styles.colorPreview, { backgroundColor: formData.color }]} />
                  <Text style={styles.selectedColorText}>Color seleccionado</Text>
                </TouchableOpacity>
                
                <View style={styles.colorGrid}>
                  {COLOR_PALETTE.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        formData.color === color && styles.colorOptionSelected,
                      ]}
                      onPress={() => updateField("color", color)}
                    >
                      {formData.color === color && (
                        <View style={styles.colorCheckmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {errors.color && (
                <Text style={styles.errorText}>{errors.color}</Text>
              )}
            </View>
          </View>

          {/* Preview */}
          {formData.name && (
            <View style={styles.previewSection}>
              <Text style={styles.sectionTitle}>Vista Previa</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <View style={[styles.previewIcon, { backgroundColor: formData.color + "20" }]}>
                    <FolderOpen size={24} color={formData.color} />
                  </View>
                  <View style={styles.previewInfo}>
                    <Text style={styles.previewName}>{formData.name}</Text>
                    <Text style={styles.previewDescription}>
                      {formData.description || "Sin descripción"}
                    </Text>
                  </View>
                  <View style={[styles.previewColorDot, { backgroundColor: formData.color }]} />
                </View>
                <View style={styles.previewStats}>
                  <View style={styles.previewStatItem}>
                    <Text style={styles.previewStatLabel}>Productos</Text>
                    <Text style={styles.previewStatValue}>
                      {isEditMode && editCategory ? editCategory.totalProducts : "0"}
                    </Text>
                  </View>
                  <View style={styles.previewStatItem}>
                    <Text style={styles.previewStatLabel}>Activos</Text>
                    <Text style={styles.previewStatValue}>
                      {isEditMode && editCategory ? editCategory.activeProducts : "0"}
                    </Text>
                  </View>
                  <View style={styles.previewStatItem}>
                    <Text style={styles.previewStatLabel}>Bajo Stock</Text>
                    <Text style={styles.previewStatValue}>
                      {isEditMode && editCategory ? editCategory.lowStockProducts : "0"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading
                ? isEditMode
                  ? "Actualizando..."
                  : "Creando..."
                : isEditMode
                  ? "Actualizar Categoría"
                  : "Crear Categoría"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  colorPaletteContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  selectedColorDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  paletteIcon: {
    marginRight: 8,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  selectedColorText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  colorCheckmark: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  previewSection: {
    marginBottom: 32,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  previewDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  previewColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  previewStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  previewStatItem: {
    alignItems: "center",
  },
  previewStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  previewStatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
