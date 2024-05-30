import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    try {
      const user = {
        name: name,
        email: email,
        password: password,
      };
      axios
        .post("http://localhost:8000/register", user)
        .then((response) => {
          Alert.alert(
            "Registration Successfully",
            "Please check your email to verify the email"
          );
          setEmail("");
          setName("");
          setPassword("");
        })
        .catch((error) => {
          Alert.alert("error in registration", error);
          console.log("ERROR IN REGISTERING", error.message);
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
            Register your account
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          {/* for name field */}
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
              <Ionicons
                name="person"
                style={{ marginLeft: 10 }}
                size={24}
                color="gray"
              />
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                placeholderTextColor={"gray"}
                style={{
                  color: "gray",
                  width: 300,
                  marginVertical: 10,
                  fontSize: name ? 16 : 16,
                }}
                placeholder="Enter your Name"
              />
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
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

          <View style={{ marginTop: 20 }}>
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

        <View style={{ marginTop: 40 }} />

        <Pressable
          onPress={handleRegister}
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
            Register{" "}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 50 }}>
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Already have an account ? Login here
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
