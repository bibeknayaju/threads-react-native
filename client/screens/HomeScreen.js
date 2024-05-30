import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      await axios
        .get("http://localhost:8000/posts")
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("error in the fetching all the posts", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  // for liking the post
  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/post/${postId}/${userId}/like`
      );
      const updatedPost = response.data;

      const updatedPosts = posts?.map((post) =>
        post?._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  // functio for disliking the post
  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/post/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      // Update the posts array with the updated post
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image
          style={{ width: 60, height: 40, resizeMode: "contain" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        {posts?.map((post, index) => (
          <View
            key={index}
            style={{
              padding: 15,
              borderColor: "#D0D0D0",
              borderTopWidth: 1,
              flexDirection: "row",
              gap: 10,
              marginVertical: 10,
              alignItems: "center",
            }}>
            <View>
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
            </View>

            <View>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}>
                {post?.user?.name}
              </Text>
              <Text>{post?.content}</Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 15,
                }}>
                {post?.likes?.includes(userId) ? (
                  <AntDesign
                    onPress={() => handleDislike(post?._id)}
                    name="heart"
                    size={18}
                    color="red"
                  />
                ) : (
                  <AntDesign
                    onPress={() => handleLike(post?._id)}
                    name="hearto"
                    size={18}
                    color="black"
                  />
                )}

                <FontAwesome name="comment-o" size={18} color="black" />

                <Ionicons name="share-social-outline" size={18} color="black" />
              </View>

              <Text style={{ marginTop: 7, color: "gray" }}>
                {post?.likes?.length} likes • {post?.replies?.length} reply
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
