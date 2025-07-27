// src/components/Signup.jsx
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/portfolio");
    } catch (error) {
      toast({ title: "Signup Failed", status: "error", description: error.message });
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={10} p={4}>
      <Heading mb={6}>Signup for FinSageAI</Heading>
      <Stack spacing={4}>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button colorScheme="green" onClick={signup}>Create Account</Button>
      </Stack>
    </Box>
  );
};

export default Signup;