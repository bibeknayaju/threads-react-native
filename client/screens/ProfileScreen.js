import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchProfile();
  }, []);

  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    navigation.replace("Login");
  };

  return (
    <View style={{ marginTop: 55, padding: 15 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: "#D0D0D0",
            }}>
            <Text>Threads.net</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}>
          <View>
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                resizeMode: "contain",
              }}
              source={{
                uri: "https://scontent.fktm1-1.fna.fbcdn.net/v/t39.30808-6/333206470_2626021304207352_4445035252622896070_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a2f6c7&_nc_ohc=lM4ncRn8WZEAX9QFgiT&_nc_ht=scontent.fktm1-1.fna&oh=00_AfAvSdBdnHaaokHGQ8h8lFlXDEpQqcIA684GPlwZGvLKSg&oe=65171D70",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
              {user?.name}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400", marginTop: 2 }}>
              {user.email}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400", marginTop: 2 }}>
              Love Yourself
            </Text>
          </View>
        </View>
        <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
          {user?.followers?.length} followers
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
          }}>
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}>
            <Text>Edit Profile</Text>
          </Pressable>

          <Pressable
            onPress={logout}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}>
            <Text>Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
