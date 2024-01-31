import {
    FormControl,
    FormLabel,
    Input,
    VStack,
    InputGroup,
    InputRightElement,
    Button,
    useToast,
  } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
  import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [show, setShow] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();
    const navigate = useNavigate();

    const submitHandler = async () => {
      setLoading(true);
      if(!email || !password){
        toast({
          title: "Please Fill in the Fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        setLoading(false);
        return;
      }

      try{
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const {data} = await axios.post("http://localhost:5000/api/user/login", 
                        {email, password}, config);
      console.log("data", data)
        if(data){
          toast({
            title: "Login Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
  
          localStorage.setItem("userInfo", JSON.stringify(data));
          navigate("/chats");
        }
        else{
          toast({
            title: "Error while login",
            description: `Data is no available for given credentials`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
        }
        setLoading(false);
      }
      catch(err){
        if(err instanceof AxiosError){
          toast({
            title: "Error Occured!",
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
        }
        else{
          toast({
            title: "Error Occured!",
            description: "Something went wrong check console",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
          console.log("Error", err);
        }

        setLoading(false);
      }
    }
  
    return (
      <VStack spacing="5px">
        <FormControl id="login-email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
          value={email}
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="login-password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
            value={password}
              type={show?"text":"password"}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{marginTop: 15}}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
        variant="solid"
          colorScheme="red"
          width="100%"
          style={{marginTop: 15}}
          onClick={() => {
            setEmail('guest@example.com')
            setPassword("12345")
          }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    );
}

export default Login;
