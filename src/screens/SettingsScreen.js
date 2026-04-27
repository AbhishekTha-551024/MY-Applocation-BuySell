import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  const SettingItem = ({ icon, title, value, type, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color="#007AFF" />
        </View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      {type === 'switch' ? (
        <Switch 
          value={value} 
          onValueChange={onPress} 
          trackColor={{ false: '#767577', true: '#007AFF' }}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem icon="person-outline" title="Profile Details" />
          <SettingItem icon="lock-closed-outline" title="Privacy & Security" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem 
            icon="moon-outline" 
            title="Dark Mode" 
            type="switch" 
            value={isDarkMode} 
            onPress={() => setIsDarkMode(!isDarkMode)} 
          />
          <SettingItem 
            icon="notifications-outline" 
            title="Notifications" 
            type="switch" 
            value={notifications} 
            onPress={() => setNotifications(!notifications)} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem icon="help-circle-outline" title="Help Center" />
          <SettingItem icon="information-circle-outline" title="About MyApp" />
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  section: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    margin: 20,
    marginTop: 40,
    padding: 16,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
