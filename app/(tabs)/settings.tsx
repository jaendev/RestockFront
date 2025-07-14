import { Bell, ChevronRight, Database, CircleHelp as HelpCircle, Info, Moon, Shield, Smartphone, User } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme, useThemeColors } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const { isDark, setThemeMode } = useTheme();
  const colors = useThemeColors();
  
  const [notifications, setNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);

  // Handle dark mode toggle
  const handleDarkModeToggle = (value: boolean) => {
    setThemeMode(value ? 'dark' : 'light');
  };

  const settingsGroups = [
    {
      title: 'Cuenta',
      items: [
        { id: 'profile', label: 'Perfil', icon: User, hasToggle: false },
        { id: 'notifications', label: 'Notificaciones', icon: Bell, hasToggle: true, value: notifications, onToggle: setNotifications },
        { id: 'lowstock', label: 'Alertas de existencias bajas', icon: Smartphone, hasToggle: true, value: lowStockAlerts, onToggle: setLowStockAlerts },
      ],
    },
    {
      title: 'Preferencias',
      items: [
        { id: 'darkmode', label: 'Modo oscuro', icon: Moon, hasToggle: true, value: isDark, onToggle: handleDarkModeToggle },
        { id: 'privacy', label: 'Privacidad y Seguridad', icon: Shield, hasToggle: false },
      ],
    },
    {
      title: 'Datos',
      items: [
        { id: 'backup', label: 'Copiar y Sincronizar', icon: Database, hasToggle: false },
      ],
    },
    {
      title: 'Soporte',
      items: [
        { id: 'help', label: 'Centro de ayuda', icon: HelpCircle, hasToggle: false },
        { id: 'about', label: 'Sobre nosotros', icon: Info, hasToggle: false },
      ],
    },
  ];

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <User size={32} color="#FFFFFF" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@email.com</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupContainer}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    itemIndex === group.items.length - 1 && styles.lastItem
                  ]}
                  disabled={item.hasToggle}
                >
                  <View style={styles.settingContent}>
                    <View style={styles.settingIcon}>
                      <item.icon size={20} color={colors.icon} />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  {item.hasToggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.border, true: colors.primaryLight }}
                      thumbColor={item.value ? colors.primary : colors.surface}
                    />
                  ) : (
                    <ChevronRight size={20} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.version}>Versión 1.0.0</Text>
          <Text style={styles.copyright}>© 2025 RESTOCK</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Dynamic styles based on theme colors
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  groupContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  version: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: colors.textMuted,
  },
});