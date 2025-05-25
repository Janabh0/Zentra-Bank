import { signup } from "@/api/auth";
import AuthContext from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const { setIsAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // useMutation -> fn: signup (name, password, image) -> succesfull? setIsAuth(true) & go to home

  const { mutate } = useMutation({
    mutationKey: ["register"],
    mutationFn: () => signup(name, password, image || ""),
    onSuccess: () => {
      setIsAuthenticated(true);
      router.replace("/");
    },
  });

  const handleRegister = () => {
    // console.log({ name, password, image });
    mutate();
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={pickImage}>
        <View
          style={{
            backgroundColor: "gray",
            width: 100,
            height: 100,
            borderRadius: 100,
            marginBottom: 24,
          }}
        >
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
              }}
            />
          )}
        </View>
      </TouchableOpacity>
      <TextInput
        placeholder="Username"
        style={{
          borderWidth: 1,
          width: "90%",
          padding: 5,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onChangeText={(text) => setName(text.toLowerCase())}
      />
      <TextInput
        placeholder="Password"
        style={{
          borderWidth: 1,
          width: "90%",
          padding: 5,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onChangeText={(text) => setPassword(text.toLowerCase())}
      />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({});
