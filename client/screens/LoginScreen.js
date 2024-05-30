import {
  StyleSheet,
  View,
  Image,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  // checking the login status
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          setTimeout(() => {
            navigation.replace("Main");
          }, 0);
        }
      } catch (error) {
        console.log("ERROR message ", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    try {
      const user = {
        email: email,
        password: password,
      };
      axios
        .post("http://localhost:8000/login", user)
        .then((response) => {
          console.log("FROM LOGIN", response);
          const token = response.data.token;
          AsyncStorage.setItem("authToken", token);
          navigation.replace("Main");
        })
        .catch((error) => {
          Alert.alert("ERROR IN LOGIN", error.message);
        });
    } catch (error) {
      console.log("Error in the registering the user", error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View style={{ marginTop: 50 }}>
        <Image
          style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 20 }}>
            Login to your account{" "}
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={{ marginTop: 40 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 5,
              }}>
              <MaterialIcons
                style={{ marginLeft: 10 }}
                name="email"
                size={24}
                color="gray"
              />
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholderTextColor={"gray"}
                style={{
                  color: "gray",
                  width: 300,
                  marginVertical: 10,
                  fontSize: email ? 16 : 16,
                }}
                placeholder="Enter your email"
              />
            </View>
          </View>

          <View style={{ marginTop: 40 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 5,
              }}>
              <AntDesign
                style={{ marginLeft: 10 }}
                name="lock"
                size={24}
                color="gray"
              />
              <TextInput
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor={"gray"}
                style={{
                  color: "gray",
                  width: 300,
                  marginVertical: 10,
                  fontSize: password ? 16 : 16,
                }}
                placeholder="Enter your password"
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 13,
          }}>
          <Text>Keep me logged in</Text>
          <Text style={{ fontWeight: "500", color: "#007FFF" }}>
            Forgot Password
          </Text>
        </View>

        <View style={{ marginTop: 40 }} />

        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "black",
            padding: 15,
            marginTop: 40,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6,
          }}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
              color: "white",
            }}>
            Login{" "}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 50 }}>
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Don't have and account ? Sign up here
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
