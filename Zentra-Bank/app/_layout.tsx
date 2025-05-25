import { getToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function RootLayout() {
  //Create a state to keep track of the user's authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  // create my query client
  const queryClient = new QueryClient();

  const checkToken = async () => {
    const token = await getToken();
    if (token) {
      setIsAuthenticated(true);
    }
    setReady(true);
  };

  if (!ready) {
    <View>
      <Text>LOADING APP</Text>
    </View>;
  }

  // /Login -> auth/login
  // useEffect will run the check token code the second my app launches or reloads

  useEffect(() => {
    checkToken();
  }, []);
  return (
    // provide my client to the entire app
    <QueryClientProvider client={queryClient}>
      {/* Provide the values for the auth context */}
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Stack />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
