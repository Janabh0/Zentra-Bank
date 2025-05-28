import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { API_CONFIG, buildUrl } from "../../api/config";

const register = async (
  username: string,
  password: string,
  imageUri?: string | null
) => {
  const formData = new FormData();

  formData.append("username", username);
  formData.append("password", password);

  if (imageUri) {
    const fileName = imageUri.split("/").pop() || "profile.jpg";
    const fileType = fileName.split(".").pop();

    formData.append("image", {
      uri: imageUri,
      name: fileName,
      type: `image/${fileType}`,
    } as any);
  }

  const response = await axios.post(
    buildUrl(API_CONFIG.ENDPOINTS.REGISTER),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const registerMutation = useMutation({
    mutationFn: ({
      username,
      password,
      imageUri,
    }: {
      username: string;
      password: string;
      imageUri?: string | null;
    }) => register(username, password, imageUri),
    onSuccess: () => {
      Alert.alert("Success", "Registration complete. Please log in.", [
        {
          text: "OK",
          onPress: () => router.replace("/(auth)/Login"),
        },
      ]);
    },
    onError: (error: any) => {
      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const handleRegister = () => {
    if (!username || !password) {
      Alert.alert("Missing Info", "Username and password are required.");
      return;
    }

    registerMutation.mutate({ username, password, imageUri: image });
  };

  const goToLogin = () => {
    router.push("/(auth)/Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image
              source={{
                uri: image,
              }}
              style={styles.profileImage}
            />
          ) : (
            // <Text style={styles.uploadText}>Upload Photo (optional)</Text>
            <Image source={{ uri: "../assets/default-avatar.png" }} />
          )}
        </View>
      </TouchableOpacity>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={registerMutation.isPending}
      >
        <Text style={styles.buttonText}>
          {registerMutation.isPending ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToLogin} style={styles.loginLink}>
        <Text style={styles.loginText}>
          Already have an account? Login here
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  imageContainer: {
    backgroundColor: "#f0f0f0",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  uploadText: {
    color: "#666",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: "#007AFF",
    textAlign: "center",
  },
});
