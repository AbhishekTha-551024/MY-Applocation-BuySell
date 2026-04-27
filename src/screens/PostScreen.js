import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { PostService } from '../services/postService';
import { LocationService } from '../services/locationService';
import { useAuth } from '../context/AuthContext';

const PostScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('offer'); // buy, sell, offer, trade
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!title || !description) {
      Alert.alert('Missing Info', 'Please provide a title and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Get Location
      const coords = await LocationService.getCurrentLocation();
      const neighborhood = await LocationService.getNeighborhood(coords.latitude, coords.longitude);

      // 2. Upload Image if exists
      let imageUrl = null;
      if (image) {
        imageUrl = await PostService.uploadImage(image);
      }

      // 3. Submit Post
      await PostService.createPost(user.uid, user.name, {
        title,
        description,
        type,
        price,
        image: imageUrl,
        location: { ...coords, neighborhood }
      });

      Alert.alert('Success', 'Your post is live in your neighborhood!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Post Failed', 'Something went wrong while sharing your post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const TypeBadge = ({ value, label, icon }) => (
    <TouchableOpacity 
      style={[styles.typeBadge, type === value && styles.typeBadgeActive]} 
      onPress={() => setType(value)}
    >
      <Ionicons name={icon} size={18} color={type === value ? '#fff' : '#666'} />
      <Text style={[styles.typeLabel, type === value && styles.typeLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity style={styles.submitTop} onPress={handlePost} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.submitTopText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>What are you sharing?</Text>
        <View style={styles.typeRow}>
          <TypeBadge value="offer" label="Service" icon="gift-outline" />
          <TypeBadge value="sell" label="Sell" icon="pricetag-outline" />
          <TypeBadge value="buy" label="Buy" icon="cart-outline" />
          <TypeBadge value="trade" label="Free" icon="repeat-outline" />
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={32} color="#999" />
              <Text style={styles.imagePlaceholderText}>Add a Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.inputTitle}
          placeholder="Title (e.g., Free Moving Boxes)"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />

        <TextInput
          style={styles.inputPrice}
          placeholder="Price (Optional, e.g., 20)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.inputDescription}
          placeholder="Description (Tell your neighbors more...)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
        />

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Your location will be shared as your neighborhood name only (geofenced).
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitTopText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '700',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#eee',
  },
  typeBadgeActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeLabelActive: {
    color: '#fff',
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  inputTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    marginBottom: 20,
  },
  inputPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 20,
  },
  inputDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 40,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: '#007AFF',
    fontSize: 13,
    lineHeight: 18,
  },
});
