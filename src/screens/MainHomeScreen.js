import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const MainHomeScreen = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hello, {user?.name || 'User'}!</Text>
            <Text style={styles.emailText}>{user?.email}</Text>
            <Text style={styles.dateText}>Sunday, April 26</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={40} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Dashboard</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: i % 2 === 0 ? '#E3F2FD' : '#F3E5F5' }]}>
              <Ionicons 
                name={i % 2 === 0 ? 'checkmark-circle' : 'notifications'} 
                size={20} 
                color={i % 2 === 0 ? '#1976D2' : '#7B1FA2'} 
              />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Activity Item {i}</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  emailText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
