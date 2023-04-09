import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import FlexBetween from "components/FlexBetween";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredPosts = posts.filter(
    (post) =>
    post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
    <br />
    <FlexBetween
      backgroundColor={neutralLight}
      borderRadius="9px"
      gap="3rem"
      padding="0.1rem 1.5rem"
    >
      <InputBase
      type="text"
      placeholder="Search posts ..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      />
    </FlexBetween>
    
      {filteredPosts.length === 0 ? (
      <p>No posts found.</p>
      ) : (
      filteredPosts.map(
      ({
      _id,
      userId,
      firstName,
      lastName,
      description,
      location,
      picturePath,
      userPicturePath,
      likes,
      comments,
      }) => (
        <PostWidget
        key={_id}
        postId={_id}
        postUserId={userId}
        name={`${firstName} ${lastName}`}
        description={description}
        location={location}
        picturePath={picturePath}
        userPicturePath={userPicturePath}
        likes={likes}
        comments={comments}
        />
        )
      ).reverse()
      )}
    </>
  );
};

export default PostsWidget;