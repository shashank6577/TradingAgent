// src/components/Login.jsx
import {Link } from "react-router-dom"; 
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  useToast,
Text,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/portfolio");
    } catch (error) {
      toast({ title: "Login Failed", status: "error", description: error.message });
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/portfolio");
    } catch (error) {
      toast({ title: "Google Login Failed", status: "error", description: error.message });
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={10} p={4}>
      <Heading mb={6}>Login to FinSageAI</Heading>
      <Stack spacing={4}>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button colorScheme="blue" onClick={login}>Login</Button>
        <Button onClick={loginWithGoogle}>Login with Google</Button>
            <Text fontSize="sm">
            Don’t have an account?{" "}
            <Link to="/signup" style={{ color: "blue" }}>
                Sign up
            </Link>
                </Text>
      </Stack>
    </Box>
  );
};

export default Login;