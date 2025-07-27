// src/components/Header.jsx

import {
  Box,
  Flex,
  HStack,
  Spacer,
  Text,
  Image,
  Link as ChakraLink,
  Button,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/google1.jpeg"; // ✅ Use correct relative path

const Header = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <Box
      bg="white"
      px={8}
      py={4}
      boxShadow="sm"
      borderBottom="1px solid #e5e5e5"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex alignItems="center">
        {/* === Logo and Colored Brand Text === */}
        <HStack spacing={2}>
          <Image src={logo} alt="Google AI Logo" boxSize="30px" />
          <HStack spacing={0}>
            <Text fontSize="xl" fontWeight="bold" color="#4285F4">F</Text>
            <Text fontSize="xl" fontWeight="bold" color="#EA4335">i</Text>
            <Text fontSize="xl" fontWeight="bold" color="#FBBC05">n</Text>
            <Text fontSize="xl" fontWeight="bold" color="#34A853">S</Text>
            <Text fontSize="xl" fontWeight="bold" color="#4285F4">a</Text>
            <Text fontSize="xl" fontWeight="bold" color="#EA4335">g</Text>
            <Text fontSize="xl" fontWeight="bold" color="#FBBC05">e</Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">AI</Text>
          </HStack>
        </HStack>

        <Spacer />

        {/* === Navigation Menu === */}
        <HStack spacing={8}>
          <ChakraLink
            as={Link}
            to="/"
            fontWeight={location.pathname === "/" ? "bold" : "medium"}
            fontSize="md"
            color="#4285F4"
            _hover={{ textDecoration: "underline", color: "#3367D6" }}
          >
            Home
          </ChakraLink>

          <ChakraLink
            as={Link}
            to="/exchanges"
            fontWeight={location.pathname === "/exchanges" ? "bold" : "medium"}
            fontSize="md"
            color="#EA4335"
            _hover={{ textDecoration: "underline", color: "#D93025" }}
          >
            Exchanges
          </ChakraLink>

          <ChakraLink
            as={Link}
            to="/coins"
            fontWeight={location.pathname === "/coins" ? "bold" : "medium"}
            fontSize="md"
            color="#FBBC05"
            _hover={{ textDecoration: "underline", color: "#F9AB00" }}
          >
            Coins
          </ChakraLink>

          {user && (
            <ChakraLink
              as={Link}
              to="/portfolio"
              fontWeight={location.pathname === "/portfolio" ? "bold" : "medium"}
              fontSize="md"
              color="#34A853"
              _hover={{ textDecoration: "underline", color: "#0F9D58" }}
            >
              Portfolio
            </ChakraLink>
          )}
        </HStack>

        <Spacer />

        {/* === Auth Buttons === */}
        <HStack spacing={4}>
          {user ? (
            <>
              <Text fontSize="sm" color="gray.700" fontWeight="medium">
                {user.email}
              </Text>
              <Button colorScheme="red" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <ChakraLink
                as={Link}
                to="/login"
                fontWeight="medium"
                color="gray.700"
                _hover={{ color: "#4285F4", textDecoration: "underline" }}
              >
                Login
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/signup"
                fontWeight="medium"
                color="gray.700"
                _hover={{ color: "#EA4335", textDecoration: "underline" }}
              >
                Signup
              </ChakraLink>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;