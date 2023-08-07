// @ts-nocheck

import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import CustomInput from "../components/CustomInput"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

type Inputs = {
    username: String,
    password: String,
    server: String
}
/*
const ChakraBox = chakra(motion.div, {
    
     
    shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
  });
  */

const schema = yup.object({
    username: yup.string().matches(/^[a-zA-Z][a-zA-Z0-9]*$/, 'Username must contain ONLY alphanumeric values').min(3, 'Minimum 3 characters').max(10, 'Maximum 10 characters').required('You need to enter a username'),
    password: yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number').required('Please enter a password'),
}).required()

export default function Login() {

    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
      } = useForm<Inputs>({ resolver: yupResolver(schema) });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true);

        try {
            let res = await axios.post(`${import.meta.env.VITE_REMOTE_API}/auth/login`, data);
            localStorage.setItem('echobot-jwt', res.headers['auth-token']);
            navigate('/dashboard');
        } catch (e) {
            setError("server", { type: "custom", message: "Email or password not corresponding." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Flex h='100vh' w='100%' color='white' >
            
            <Flex w='50%' h='100%' bg='#2B2D31' gap={100} flexDirection='column' justifyContent='center' alignItems='center'>

                <Heading size='3xl'>Login</Heading>

                <Box w='70%'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CustomInput helperText=""  error={errors.username} register={register("username")}>Username :</CustomInput>
                        <CustomInput type='password' helperText=""  error={errors.password} register={register("password")}>Password :</CustomInput>
                        
                        {errors.server && 
                            <Flex  justifyContent='right'>
                                <Text color='#913031' >Username or password not matching.</Text>
                            </Flex>    
                        }
                        <Spacer h={5} />
                        <Flex justifyContent='right'>
                            <Button type='submit' isLoading={loading} >Submit</Button>
                        </Flex>
                    </form>

                    <Spacer h={2} />

                    <Flex justifyContent='right'>
                        <Text>No account yet ? <Link to="/register" color="#5865F2" > Register !</Link></Text>
                    </Flex>
                </Box>
            </Flex>

            <Box w='50%' bg='#313338'>
            </Box>

        </Flex>
    )
}