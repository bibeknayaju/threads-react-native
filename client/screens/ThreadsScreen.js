import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";

const ThreadsScreen = () => {
  const [content, setContent] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const [user, setUser] = useState("");

  const handlePostSubmit = async () => {
    try {
      const postData = {
        userId,
      };

      if (content) {
        postData.content = content;
      }

      await axios
        .post("http://localhost:8000/create-post", postData)
        .then((response) => {
          setContent("");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("error in the creating the post", error);
    }
  };

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
  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
          marginTop: 12,
        }}>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://scontent.fktm1-1.fna.fbcdn.net/v/t39.30808-6/333206470_2626021304207352_4445035252622896070_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a2f6c7&_nc_ohc=lM4ncRn8WZEAX9QFgiT&_nc_ht=scontent.fktm1-1.fna&oh=00_AfAvSdBdnHaaokHGQ8h8lFlXDEpQqcIA684GPlwZGvLKSg&oe=65171D70",
          }}
        />

        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{user?.name}</Text>
          <Text>{user.email}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"black"}
          placeholder="Type your message..."
          multiline
        />
      </View>

      <View style={{ marginTop: 20 }} />

      <Button onPress={handlePostSubmit} title="Share Post" />
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({});
